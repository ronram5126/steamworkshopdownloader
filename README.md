# Steam Workshop Collection Downloader

Simple steam workshop collection downloader built using nodejs. *This package only downloads workshop collections, not individual workshop file. please use [Steam Workshop Download](http://steamworkshop.download/) for individual packages.* Follow the instruction below to use this.

1. Firstly you will need Node JS installed in your pc. you can get it from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).
2. Download or Clone the repository.
3. Open cmd or bash in the directory where repository was cloned.
4. Run `npm install` command on cmd or bash to install required libraries.
5. Now open urls.txt using any texteditor and put urls to *collections* as it is provided in given example.
6. Run `npm start` command to start downloading. All your downloads should be under downloads folder.

**note: if you want to change the  default file extension from .zip use `npm start <new extension>` command instead of `npm start`**
