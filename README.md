# On The Record

On The Record is a social network with a focus on sharing music opinions with friends. This web app uses Next14 to deliver the UI, along with a Go backend (see the [On The Record API](https://github.com/liamcr/on-the-record-api)) and PostgreSQL database to deliver a seamless experience with a modern look and feel. Make a post to share with friends, or follow your friends to see what they've been listening to.

## Make a Review

Reviews are the simplest kind of posts to make, just select an album or track, give it a score out of 10, and you're all set. You can optionally add a description if you'd like as well.

<img src="https://github.com/liamcr/on-the-record/assets/33944844/2ce72b6b-6124-498d-ba12-c36d42ec8d94" width="300">


## Make a Top-5 List

What were your top five favourite albums from your childhood? What about your favourite pop artists? Top-five best songs that start with the letter "A"? Whatever you want to list, you can do it and share it with your friends in less than a minute. You can also customize the background colour to whatever you think fits best.

<img src="https://github.com/liamcr/on-the-record/assets/33944844/251f5193-4c28-4efc-8289-2f1d51243b8c" width="300">

## Customize Your Profile

You, along with your music taste, are unique, which is why you're encouraged to customize your profile to what reflects you the best. You can update the app theme by changing your favourite colour, or change the music opinons that are pinned under your profile, such as your favourite artist, or favourite sad song.

<img src="https://github.com/liamcr/on-the-record/assets/33944844/bf739c3e-398e-4cf3-9450-d213c3e401a7" width="300">

## Deployment

Build a new image that will be pushed to docker hub:

`docker build -t liamcrocketdev/otr:VERSION .`

Where `VERSION` is a valid semver value (e.g. `0.3.0`)

Then push that image:

`docker push liamcrocketdev/otr:VERSION`

In GCP, navigate to Cloud Run, click `otr`, click `EDIT & DEPLOY NEW REVISION`, update the
version in the `Container image URL` field to match the version that was just pushed, and
click `DEPLOY`. The new version of the site should come up shortly after.
