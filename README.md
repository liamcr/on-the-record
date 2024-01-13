# On The Record

## Deployment

Build a new image that will be pushed to docker hub:

`docker build -t liamcrocketdev/otr:VERSION .`

Where `VERSION` is a valid semver value (e.g. `0.3.0`)

Then push that image:

`docker push liamcrocketdev/otr:VERSION`

In GCP, navigate to Cloud Run, click `otr`, click `EDIT & DEPLOY NEW REVISION`, update the
version in the `Container image URL` field to match the version that was just pushed, and
click `DEPLOY`. The new version of the site should come up shortly after.
