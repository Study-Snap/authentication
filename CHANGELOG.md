# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Released]

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
