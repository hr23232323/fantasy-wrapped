# Makefile (Production)

# Variables
GCP_PROJECT=fantasy-trade-targets
APP_NAME=fantasy-app

# Make commands to deploy app to GCP Cloud Run

.PHONY: set-gcp-project
set-gcp-project:
	gcloud config set project $(GCP_PROJECT)


# Build for Cloud Run
.PHONY: build-cloud
build-cloud:
	docker buildx build \
		--platform linux/amd64 \
		-t gcr.io/$(GCP_PROJECT)/$(APP_NAME) \
		-f prod.Dockerfile \
		.


.PHONY: push
push:
	docker push gcr.io/$(GCP_PROJECT)/$(APP_NAME)


.PHONY: deploy
deploy:
	$(MAKE) set-gcp-project && $(MAKE) build-cloud && $(MAKE) push && gcloud run deploy $(APP_NAME) \
	--image gcr.io/$(GCP_PROJECT)/$(APP_NAME) \
	--platform managed \
	--region us-central1 \
	--allow-unauthenticated \
	--port 3000