# Steam Workshop Collection Downloader

Simple steam workshop collection downloader built using nodejs. **This package only downloads workshop collections, not individual workshop file. please use [Steam Workshop Download](http://steamworkshop.download/) for individual packages.** Follow the instruction below to use this.

1. Firstly you will need Node JS installed in your pc. you can get it from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).
2. Download or Clone the repository. (you can do it using the clone or download button and download zip, extract the zip into a folder.)
3. Open cmd or bash in the directory where repository was cloned. *(open cmd or bash and go to the directory. make sure it is prompting on the same drive c: or d: and use `cd <directory where you have the file from git>`.)*
4. Run `npm install` command on cmd or bash to install required libraries.
5. Now open urls.txt using any texteditor and put urls to **collections** as it is provided in given example. *(make sure that the url are to the collection and that they are seperated by line break `<enter>`)*
6. Run `npm start` command to start downloading. All your downloads should be under downloads folder.

*note: if you want to change the  default file extension from .zip use `npm start <new extension>` command instead of `npm start`*
