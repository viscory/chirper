
# Chirper
### Introduction

Chirper is a full-stack clone of Twitter reimplemented completely in Next.JS. To run the actual application we had used a vercel deployment, to manage our packages we used npm/yarn, for our database we used firebase/firestore, and for your styling we used tailwind css.

=============

### Running the project

1. Clone the project from here

[GitHub - viscory/chirper: chirp chirp](https://github.com/viscory/chirper)

1. create a new .env.local in the root folder of this project
2. paste the following lines into the .env.local file, this is created to avoid our keys being stolen from other users, since this is a public repo

```jsx
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET_KEY=
NEXT_PUBLIC_apiKey=
NEXT_PUBLIC_authDomain=
NEXT_PUBLIC_projectId=
NEXT_PUBLIC_storageBucket=
NEXT_PUBLIC_messagingSenderId=
NEXT_PUBLIC_appId=
NEXT_PUBLIC_measurementId=
NEXT_PUBLIC_ADMIN_ID=
```

1. run the following code to start this project locally

```jsx
npm run dev
```

1. for installations, let’s use npm, meaning run the following for installations

```jsx
npm install <package-name> //avoid using "yarn install ..." to avoid package clashes
```

2. good luck lol
3. Admin login: email: admin@chirper.com, pw: 123456
4. check the .env.local has the admin id, then it could access admin page and its functions as proposed

=============

### Directory structure 

├── components
│   ├── Chirps (components related to a chirp made by a user
│   │   ├── Comment.js
│   │   ├── Feed.js
│   │   ├── Post.js
│   │   ├── Profile.js
│   │   ├── Settings.js
│   │   └── SinglePost.js
│   ├── Common # components related to the sidebars in the feedpage
│   │   ├── Input.js
│   │   ├── Modal.js
│   │   ├── Sidebar.js
│   │   ├── SidebarLink.js
│   │   ├── ThemeButton.js
│   │   ├── Trending.js
│   │   └── TrendingList.js
│   ├── Login.js # the login page
│   └── users # the admin user list
│       └── userList.js
├── contexts # boilerplate
│   └── AppContext.js
├── firebase.js # boilerplate
├── pages
│   ├── admin.js # admin verification
│   ├── api
│   │   ├── auth
│   │   │   └── [...nextauth].js
│   │   └── hello.ts
│   ├── _app.tsx # boilerplate
│   ├── chat
│   │   └── [...id].tsx # talkjs configuration
│   ├── chirps
│   │   └── [...pid].js # boilerplate
│   ├── _document.tsx
│   ├── index.tsx # home page/ boilerplate
│   ├── login.tsx # login flow
│   ├── profile
│   │   └── [...tag].js # boilerplate
│   ├── search
│   │   └── [id].js # search functionality
│   ├── settings
│   │   └── [...tag].js # boilerplate
│   └── signup.tsx
└── styles # style sheets for different components and html elements
    ├── adminpage.css
    ├── common.css
    ├── feedpage.css
    ├── globals.css
    ├── login.css
    ├── profile.css
    └── settings.css

15 directories, 37 files

=============

### Demo
1. Prior to starting the project demo, go to you device console and clear you localStorage to ensure you start the project from stratch.
2. Sign up for a new account: go to /signup, lets create the account for demo,
    username: demo
    tag: demo
    email: demo@chirper.com
    password: 123456
3. create a tweet with text AND image you want (do it randomly)
4. create another tweet and set it as nsfw
5. logout and sign back in again to prove the account exists
6. like one of your tweets and dislike another one
7. add a comment to one of your tweets
8. click on the post you commented on to prove the comment exists\
9. click on the profile page in the sidebar to display the user profile
10. go to /admin (need to type it in the url), you should be blocked and redirected to /
11. go to the top right search bar, enter “admin” and PRESS ENTER to search
12. you should see the search result: the admin account
13. click “follow” to follow the admin account
14. go to the home page, you should see the posts of admin
15. go back to the search result (previous page), and click “chat”
16. you’re in a chatroom with the admin, send a message to him
17. exit the chatroom and logout of this account
18. login as the admin (email: admin@chriper.com, pw: 123456)
19. after logging in, enter “demo” into the search bar and search the account you created
20. click “chat” and you can see your chatroom
21. go to /admin (need to type it in the url)
22. you can see all the users here, delete the demo account
23. (do this step only if you’re preparing) go to firebase authentication, delete the demo account to ensure you can use demo@chirper.com to sign up again.

=============

###Features

Client-Server architecture (by choosing NextJS)

GUI (frontend)

Database integration (Firestore)

User signup/login via Google account and logout

Post tweet

Delete tweet

Comment on tweet

Like and dislike tweet

Search for user

Follow other users

Show feed (other users’ tweets)

Admin UI

List all users

Delete users

Retweet (5%)

inbox messaging

spam detection

tweet privacy control

user tutorial

post location and map display

# Credits

Thank you to Mukit for working on the UML and bringing the laptop for demo
Thank you to Matthew for handling the bulk of the software development
-
