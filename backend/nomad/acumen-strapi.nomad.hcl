job "Acumen-Strapi" {
  datacenters = ["glynac-dc"]
  type = "service"

  update {
    max_parallel     = 1
    health_check     = "task_states"
    min_healthy_time = "30s"
  }

  group "strapi-backend" {
    count = 1
    
    network {
      port "http" {
        static = 5603
        to     = 5603
      }
    }
    
    service {
      name = "acumen-strapi"
      tags = ["apps", "strapi"]
      port = "http"
      
      check {
        name     = "strapi-tcp"
        type     = "tcp"
        port     = "http"
        interval = "30s"
        timeout  = "5s"
      }
    }

    constraint {
      attribute = "${attr.unique.hostname}"
      value     = "worker-07"
    }

    task "strapi" {
      driver = "docker"

      config {
        image = "ghcr.io/friendy21/acumen-blogs/strapi:latest"
        ports = ["http"]
        
        # Authentication for GitHub Container Registry
        auth {
          username = "friendy21"
          password = "GITHUB_PAT_TOKEN"  # Replace with actual token from Nomad variable
        }
      }

      env {
        NODE_ENV = "production"
        HOST     = "0.0.0.0"
        PORT     = "5603"
      }

      template {
        data = <<EOF
{{ with nomadVar "nomad/jobs/Acumen-Strapi" }}
APP_KEYS={{ .APP_KEYS }}
API_TOKEN_SALT={{ .API_TOKEN_SALT }}
ADMIN_JWT_SECRET={{ .ADMIN_JWT_SECRET }}
TRANSFER_TOKEN_SALT={{ .TRANSFER_TOKEN_SALT }}
JWT_SECRET={{ .JWT_SECRET }}
DATABASE_CLIENT={{ .DATABASE_CLIENT }}
DATABASE_HOST={{ .DATABASE_HOST }}
DATABASE_PORT={{ .DATABASE_PORT }}
DATABASE_NAME={{ .DATABASE_NAME }}
DATABASE_USERNAME={{ .DATABASE_USERNAME }}
DATABASE_PASSWORD={{ .DATABASE_PASSWORD }}
DATABASE_SSL={{ .DATABASE_SSL }}
{{ end }}
EOF
        destination = "secrets/.env"
        env         = true
      }

      resources {
        cpu    = 200
        memory = 200
      }
    }
  }
}
