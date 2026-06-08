import os
import json

class ProjectGenesisEngine:
    def __init__(self):
        # Establish base structural sandbox directory root mapping path safely
        self.workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../sandbox_workspace"))
        if not os.path.exists(self.workspace_root):
            os.makedirs(self.workspace_root)
        print("🚀 [Genesis Engine v2] Autonomous DevOps Orchestration Stack Active.")

    def spawn_production_stack(self, project_name: str, framework: str = "FastAPI") -> dict:
        """
        One Prompt Strategy: Generates complete application source code, production Docker setup,
        GitHub CI/CD workflows, Prometheus telemetry monitoring configurations, and detailed documentation.
        """
        project_path = os.path.join(self.workspace_root, project_name)
        print(f"\n⚡ [Genesis v2] Initiating full DevOps production scaffold for: '{project_name}' inside path: {project_path}")

        # 📂 Step 1: Initialize complete enterprise directory tree paths
        directories = [
            project_path,
            os.path.join(project_path, "app"),
            os.path.join(project_path, "tests"),
            os.path.join(project_path, ".github", "workflows"),
            os.path.join(project_path, "monitoring", "prometheus"),
            os.path.join(project_path, "deployment"),
        ]
        for folder in directories:
            os.makedirs(folder, exist_ok=True)

        # 📝 Write File 1: Production Application Code Script
        app_code = (
            "from fastapi import FastAPI\n"
            "import os\n\n"
            "app = FastAPI(title='Genesis Spawned Production Mesh Microservice', version='1.0')\n\n"
            "@app.get('/')\n"
            "async def root_ping():\n"
            "    return {\n"
            "        'status': 'healthy',\n"
            "        'environment': os.getenv('ENV_MODE', 'production'),\n"
            "        'telemetry': 'active_mesh_monitoring'\n"
            "    }\n"
        )
        with open(os.path.join(project_path, "app", "main.py"), "w", encoding="utf-8") as f:
            f.write(app_code)

        # 📝 Write File 2: Automated Testing Unit Scripts
        test_code = (
            "from fastapi.testclient import TestClient\n"
            "from app.main import app\n\n"
            "client = TestClient(app)\n\n"
            "def test_production_endpoint_health():\n"
            "    response = client.get('/')\n"
            "    assert response.status_code == 200\n"
            "    assert response.json()['status'] == 'healthy'\n"
        )
        with open(os.path.join(project_path, "tests", "test_core.py"), "w", encoding="utf-8") as f:
            f.write(test_code)

        # 📝 Write File 3: Production Multi-Stage Dockerfile Layout
        dockerfile_content = (
            "FROM python:3.11-slim AS builder\n"
            "WORKDIR /app\n"
            "RUN pip install --no-cache-dir poetry uvicorn fastapi testclient\n"
            "COPY . /app\n"
            "RUN pytest tests/\n\n"
            "FROM python:3.11-slim AS production\n"
            "WORKDIR /app\n"
            "COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages\n"
            "COPY --from=builder /usr/local/bin /usr/local/bin\n"
            "COPY ./app /app/app\n"
            "EXPOSE 8000\n"
            "ENV ENV_MODE=production\n"
            "CMD ['uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8000']\n"
        )
        with open(os.path.join(project_path, "Dockerfile"), "w", encoding="utf-8") as f:
            f.write(dockerfile_content)

        # 📝 Write File 4: Advanced GitHub Actions CI/CD Pipeline Workflow
        cicd_workflow = (
            "name: Production Deployment Automation Mesh (CI/CD)\n\n"
            "on:\n"
            "  push:\n"
            "    branches: [ main ]\n\n"
            "jobs:\n"
            "  verify-and-deploy:\n"
            "    runs-on: ubuntu-latest\n"
            "    steps:\n"
            "    - name: Checkout Source Assets Code Repository\n"
            "      uses: actions/checkout@v3\n\n"
            "    - name: Setup Python Environment Runtime\n"
            "      uses: actions/setup-python@v4\n"
            "      with:\n"
            "        python-version: '3.11'\n\n"
            "    - name: Run Core Test Automation Suites\n"
            "      run: |\n"
            "        pip install fastapi uvicorn httpx pytest\n"
            "        pytest tests/\n\n"
            "    - name: Build Production Container Image\n"
            "      run: docker build -t ${{ github.event.repository.name }}:latest .\n"
        )
        with open(os.path.join(project_path, ".github", "workflows", "ci-cd.yml"), "w", encoding="utf-8") as f:
            f.write(cicd_workflow)

        # 📝 Write File 5: Prometheus Telemetry Scrape Targets Dashboard Rules
        prometheus_yaml = (
            "global:\n"
            "  scrape_interval: 5s\n"
            "scrape_configs:\n"
            "  - job_name: 'genesis_production_microservice_telemetry'\n"
            "    static_configs:\n"
            "      - targets: ['backend:8000']\n"
        )
        with open(os.path.join(project_path, "monitoring", "prometheus", "prometheus.yml"), "w", encoding="utf-8") as f:
            f.write(prometheus_yaml)

        # 📝 Write File 6: Master Production README.md Complete Documentation Sheet
        readme_md = (
            f"# 🚀 {project_name.upper()} - Spelled via Project Genesis Engine v2\n\n"
            "## 🌌 Architectural Overview\n"
            "This enterprise production microservice mesh repository has been autonomously compiled and structuralized complete with multi-stage Docker builds, full GitHub CI/CD continuous validation layers, and prometheus automated instrumentation hooks.\n\n"
            "## 🛠 Execution & Deployment Command Guidelines\n"
            "To deploy the entire production stack instantly over local container meshes, run:\n"
            "```bash\n"
            "docker build -t spawned-mesh:latest .\n"
            "docker run -d -p 8000:8000 spawned-mesh:latest\n"
            "```\n\n"
            "## 📡 Telemetry Dashboard Setup\n"
            "Prometheus monitors parameters endpoints targeting container status records natively over config folder `/monitoring/prometheus/prometheus.yml`.\n"
        )
        with open(os.path.join(project_path, "README.md"), "w", encoding="utf-8") as f:
            f.write(readme_md)

        print(f"✓ DevOps Genesis Complete! Full repository blueprint constructed inside workspace folder structure securely.")
        return {
            "status": "success",
            "message": "Full-Stack DevOps Repository Scaffolded Atomically.",
            "project_deployed": project_name,
            "artifacts_generated": ["Application Core Script", "FastAPI PyTest suites", "Multi-stage Dockerfile", "GitHub CI/CD Automation Matrix", "Prometheus Scraping Engine Configuration", "Complete README Markdown Sheet"],
            "path": project_path
        }
