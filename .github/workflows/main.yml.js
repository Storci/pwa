/*
name: UNIT TEST

# Controls when the workflow will run
on:
  # Triggers the workflow on push or pull request events but only for the main branch
  push:
    branches: [ develop ]
  pull_request:
    branches: [ develop ]

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2

      - uses: actions/setup-node@v1

      - name: Install dependencies
        run: npm install

      - name: Install dependencies 2
        run: npm i jest-cli -g

      - name: Run tests
        run: jest
*/
