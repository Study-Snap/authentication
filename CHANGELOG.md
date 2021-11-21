# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.4]

### Added

- (SSPP-20): User password change feature exposed to API
- (dev): Added development ready docker-compose configuration to support future development of Authentication for StudySnap
- (SSPP-20): Implemented some more e2e tests
- (SSPP-20): Some functional support services for email modification

## [Released]

## [1.0.3]

### Added

- (SSPP-248): CI/CD tagging with unique commit hash for testing on bleeding-edge releases

## [1.0.2]

### Added

- (REF-PATHS): Added test docker-compose to simply dev testing
- (REF-PATHS): Added test docker-push to workflows for testing branched releases without waiting for staging

### Modified

- (REF-PATHS): Fixed pathing to match new DNS scheme
- (REF-PATHS): Updated test-e2e workflow to include environment setup with docker-compose
- (SSPP-192): Updated environment to match new classrooms architecture

## [1.0.1]

### Modified

- (hotfix): Fixed pathing for controller endpoints so that k8s deployment does not conflict with studysnap/neptune deployment.
- (ref): Refactored some code regarding `/auth/docs`
- (hotfix): Hopefully resolve any further issues with environment confusion by removing (renaming) `.env` to a development variant and excluding further `*.env` files from git and docker builds.

## [1.0.0]

### Added

- (SSPP-69): Swagger UI implementation available on `domain.com/docs` to help support our program documentation.
- (SSPP-77): Support for encrypted connection through SSL
- (docs): Added changelog link to main README as well as connecting link for helm chart
- (SSPP-90): CI/CD to support postgres server package in helm chart
- (SSPP-90): Octopus Deployment release process in CD

### Modified

- (SSPP-25): Modified token refresh endpoint to accept refreshToken in the form of an httpOnly cookie instead of body request.
- (SSPP-25): Updated e2e testing suite to set cookie instead for testing refresh token functionality
- (docs): Updated docs with deploy instructions
- (docs): Fixed badges on docs
- (SSPP-69): Refactored some source code

### Removed

- (SSPP-25): The old DTO for tokenRefresh as we do not require it anymore since it is impossible to pass a refreshToken using the request body

## [0.1.0]

### Added

- (docs-init): Documentation for requirements, setup and deployment instructions
- (auto-cicd): Github workflows to help automate lint, test, build and publishing of this application
- (local-auth): Local authentication that generates JWT Access & Refresh tokens for stateless authentication
- (auto-test): Unit and End-to-End (e2e) testing captured in CI process.
- (docs): Instructions for running without docker in development

### Modified

- (refactored): Codebase refactored to be easier to navigate

### Removed

- (auto-cicd): Some annoying extra linting rules provided in the recommended set.
