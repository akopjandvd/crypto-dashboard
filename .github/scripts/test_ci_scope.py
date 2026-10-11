import importlib.util
from pathlib import Path
import subprocess
import tempfile
import unittest


spec = importlib.util.spec_from_file_location("ci_scope", Path(__file__).with_name("ci_scope.py"))
scope = importlib.util.module_from_spec(spec)
spec.loader.exec_module(scope)


class ScopeTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="ci-scope-fixture-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.command("init", "--quiet")
        self.command("config", "user.email", "ci-scope@example.invalid")
        self.command("config", "user.name", "CI scope fixture")
        self.command("config", "core.autocrlf", "false")
        self.command("config", "commit.gpgsign", "false")
        (self.root / "empty-hooks").mkdir()
        self.command("config", "core.hooksPath", "empty-hooks")
        self.write("README.md", "Initial prose\n")
        self.write("src/app.js", "export default 1;\n")
        self.base = self.commit()

    def command(self, *arguments):
        return subprocess.run(["git", "-C", str(self.root), *arguments], check=True,
                              stdout=subprocess.PIPE, stderr=subprocess.PIPE).stdout.decode().strip()

    def write(self, name, text):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(text.encode("utf-8"))

    def commit(self):
        self.command("add", ".")
        self.command("commit", "--quiet", "-m", "Synthetic scope fixture")
        return self.command("rev-parse", "HEAD")

    def push(self, base=None, **kwargs):
        return scope.classify(self.root, "push", {
            "before": base or self.base, "after": self.command("rev-parse", "HEAD"),
        }, **kwargs)

    def test_vetted_prose_checks_content(self):
        self.write("README.md", "Updated prose\n")
        self.commit()
        decision = self.push()
        self.assertFalse(decision["run_full"])
        scope.validate_documents(self.root, decision)

    def test_complete_multi_commit_push_and_pr_include_earlier_code(self):
        self.write("src/app.js", "export default 2;\n")
        self.commit()
        self.write("README.md", "Later prose\n")
        head = self.commit()
        self.assertTrue(self.push()["run_full"])
        self.assertTrue(scope.classify(self.root, "pull_request", {
            "pull_request": {"base": {"sha": self.base}, "head": {"sha": head}},
        })["run_full"])

    def test_unknown_config_tests_workflow_and_other_readme_run_full(self):
        for path in ("package.json", "package-lock.json", "vite.config.js", "test/example.test.js",
                     ".github/workflows/ci.yml", ".github/scripts/ci_scope.py", "unknown.md", "src/README.md"):
            with self.subTest(path=path):
                previous = self.command("rev-parse", "HEAD")
                self.write(path, "Changed input\n")
                self.commit()
                self.assertTrue(self.push(base=previous)["run_full"])

    def test_missing_history_empty_new_branch_manual_and_wrong_checkout_run_full(self):
        self.assertTrue(self.push()["run_full"])
        for before in ("0" * 40, "f" * 40, "--invalid"):
            self.assertTrue(self.push(base=before)["run_full"])
        self.assertTrue(scope.classify(self.root, "workflow_dispatch", {})["run_full"])
        self.assertTrue(scope.classify(self.root, "pull_request", {})["run_full"])
        self.write("README.md", "Updated prose\n")
        self.commit()
        self.assertTrue(self.push(checkout_sha=self.base)["run_full"])

    def test_rename_to_allowlisted_path_runs_full(self):
        self.command("mv", "README.md", "other.md")
        before = self.commit()
        self.command("mv", "other.md", "README.md")
        self.commit()
        self.assertTrue(self.push(base=before)["run_full"])

    def test_shallow_history_requires_full_even_with_available_endpoints(self):
        self.write("README.md", "Updated prose\n")
        self.commit()
        (self.root / ".git/shallow").write_bytes((self.base + "\n").encode("ascii"))
        self.assertTrue(self.push()["run_full"])

    def test_docs_consistency_failure_does_not_pass(self):
        for content in ("Bad whitespace \n", "<<<<<<< conflict\n", "Binary\0content\n"):
            with self.subTest(content=repr(content)):
                before = self.command("rev-parse", "HEAD")
                self.write("README.md", content)
                self.commit()
                with self.assertRaises((ValueError, subprocess.CalledProcessError)):
                    scope.validate_documents(self.root, self.push(base=before))


if __name__ == "__main__":
    unittest.main()
