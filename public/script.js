const showRemainingBtn = document.querySelector("#showRemaining");
const showOriginalBtn = document.querySelector("#showOriginal");

let progressPercentTDs = document.querySelectorAll("td.progressPercent");
let percentLeftList = [];

let pagesTDs = document.querySelectorAll("td.pages");
let originalPagesTDs = [];
let audioLengthTDs = document.querySelectorAll("td.audioLength");
let originalAudioLengthTDs = [];

let table = document.getElementsByTagName("table")[0];
let infoBox = document.createElement("p");

let pagesForAll = 0;
let timeForAll = 0;

showRemainingBtn.addEventListener("click", () => {
    // console.log(progressPercentTDs);
    // console.log(pagesTDs);
    // console.log(audioLengthTDs);

    //convert the NodeList of the progress percents into just the number (remove percent signs)
    //add them to an empty array to keep order together
    for (let i = 0; i < progressPercentTDs.length; i++) {
        let text = progressPercentTDs[i].innerText;
        let numbers = text.split(" ")[0];
        let percentRemaining = (100 - numbers) / 100;
        percentLeftList.push(percentRemaining);
    }
    //console.log(percentLists);


    //now that percentLists is an array of just the numbers of percents,
    //need to convert the audio time and page number time based on those percents


    for (let i = 0; i < pagesTDs.length; i++) {
        let pageText = pagesTDs[i].innerText;
        originalPagesTDs.push(pageText);

        let pageNumbers = pageText.split(" ")[0];

        let pagesLeft = Math.floor(percentLeftList[i] * pageNumbers);
        pagesForAll += pagesLeft;
        pagesTDs[i].innerText = `${pagesLeft} pages left`;
    }
    //console.log(pagesLeftList);

    for (let i = 0; i < audioLengthTDs.length; i++) {
        originalAudioLengthTDs.push(audioLengthTDs[i].innerText);
        let hrs = Number(audioLengthTDs[i].innerText.split(" ")[0]);
        let mins = Number(audioLengthTDs[i].innerText.split(" ")[2]);

        let totalMins = (hrs * 60) + mins;
        let totalMinsRemaining = percentLeftList[i] * totalMins;
        timeForAll += totalMinsRemaining;
        console.log(`${totalMins} total minutes, ${totalMinsRemaining} minutes remaining`);
        let hrsRemaining = Math.floor(totalMinsRemaining / 60);
        let minsRemaining = Math.floor(totalMinsRemaining % 60);
        audioLengthTDs[i].innerText = `${hrsRemaining} hrs, ${minsRemaining} mins left`;
    }
    let hrsForAll = Math.floor(timeForAll / 60);
    let minsForAll = Math.floor(timeForAll % 60);
    infoBox.classList.add("mt-3");
    infoBox.innerText = `Total Pages: ${pagesForAll} pgs \n Total Time: ${hrsForAll} hrs, ${minsForAll} mins
        \nTo read in 5 days: \nPer Day: ${Math.floor(pagesForAll / 5)} pages \nPer day: ${Math.floor(timeForAll / 60 / 5)} hrs, ${Math.floor((timeForAll % 60) / 5)} mins
        \nTo read in 15 days: \nPer Day: ${Math.floor(pagesForAll / 15)} pages \nPer day: ${Math.floor(timeForAll / 60 / 15)} hrs, ${Math.floor((timeForAll % 60) / 15)} mins`;
    table.appendChild(infoBox);

    timeForAll = 0;
    pagesForAll = 0;

    showOriginalBtn.classList.remove("d-none");
    showRemainingBtn.classList.add("d-none");
});

showOriginalBtn.addEventListener("click", () => {
    for (let i = 0; i < progressPercentTDs.length; i++) {
        pagesTDs[i].innerText = originalPagesTDs[i];
        audioLengthTDs[i].innerText = originalAudioLengthTDs[i];
    }

    infoBox.innerText = "";

    showRemainingBtn.classList.remove("d-none");
    showOriginalBtn.classList.add("d-none");
});
