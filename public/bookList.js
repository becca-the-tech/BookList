//bookList is the table
let bookList = document.getElementsByTagName("bookList");

//h2 to display info from the form, form access to reset inputs at the end of click handler
let h2 = document.getElementById("info");
let form = document.querySelector("#newBookForm");

//in global scope so that each time hide() runs, it keeps track of what columns have been hidden
let hiddenList = [];

/*Note to self: form inputs that use the value need to be declared within the Listener because
otherwise they are being initialized before they even have value */


//ADD BOOKS TO TABLE

//submit button for form to add book
let formBtn = document.querySelector(".form-btn");

//unHide button, only visible once columns are hidden
let unHideBtn = document.querySelector(".unHide");


//event listener on form to add book to table
/*formBtn.addEventListener("click", function(event) {
    //telling browser not to submit form so values can be used
    event.preventDefault();

    //form selectors
    let title = document.getElementById("title").value;
    let author = document.getElementById("author").value;
    let pages = document.getElementById("pages").value;
    let audioLength = document.getElementById("audioLength").value;
    let dueOrOwn = document.getElementById("dueOrOwn").value;
    let progress = document.getElementById("progress").value;

    //creates new row and access the tableBody since that's where the new row will be appended
    let newRow = document.createElement("tr");
    let tableBody = document.getElementById("tableBody");

    //checks if bookTitle is empty since it is required
    //alerts user if it is missing without resetting the form
    if (title == '') {
        alert("Book title is required. Please fill them in.");
        return;
    }

    //TODO: still need to add form inputs and JS DOM references to Time, Status, and Completion
    newRow.innerHTML = "<td class='title'>" + title + "</td><td class='author'>" + author + "</td><td class='pages'>" + pages + " pages</td><td class='audioLength'>" + audioLength + "</td><td class='dueOrOwn'>" + dueOrOwn + "</td><td class='progress'>" + progress + "</td><td class='removable'>Remove?</td>";
*/
//adding event listener to the new td at end to book table row to remove books
newRow.lastChild.addEventListener("click", function() {
    confirmAndRemove(newRow.lastChild);
});
//add the newly filled in tr element to the table body
tableBody.appendChild(newRow);

//striping the table to make sure the pattern continues properly
striped(tableBody.children);

//clearing the form values for next usage
form.reset();

    //this was just to output info to an h2 to confirm form input was working properly
    //    h2.innerHTML = "Book Title: " + bookTitle + "<br>Author: " + author + "<br>Pages: " + pages;

});


//Removing tr's from the page when .removable is clicked
let removables = document.querySelectorAll(".removable");

//function for adding the striped class to even row numbers
function striped(arrayList) {
    for (let i = 0; i < arrayList.length; i++) {
        if (i % 2 == 0) {
            arrayList[i].classList.add("striped");
        } else {
            arrayList[i].classList = '';
        }
    }
}

//for removable column, confirms user wants removal and then carries out the removal of rows
function confirmAndRemove(target) {
    //topParent gets the target (td)'s parentNode which is tr, and grandparent of table body
    //then gets children for table body to get all the tr's
    let topParent = target.parentNode.parentNode.children;
    let confirmRemove = window.confirm("Are you sure you want to remove?");

    //targets parentNode since target is td and parent is tr to remove row
    if (confirmRemove) {
        target.parentNode.remove();
    }

    //resets the striping for the table
    striped(topParent);
}

//adding event listeners for each td item in removable column for clicks
//starting i at 1 because heading row has class removable but does not need an event listener
for (let i = 1; i < removables.length; i++) {
    removables[i].addEventListener("click", function() {
        confirmAndRemove(removables[i]);
    });
}

//adds ability to hide columns from view
function hide(column) {
    let table = document.getElementsByTagName('table')[0];

    //turns column name into the className and idName to be used later
    /*Note for self: column mutates later when new class of 'hidden' is added which is why idName has to be declared up here */
    let className = "." + column;
    let idName = "#" + column;

    //adds idName to global list of columns that have been hidden
    hiddenList.push(idName);

    //gets all th/td elements with the specified className
    let tableData = document.querySelectorAll(className);

    //adds the hidden class to each td element of specified className, sets form to disabled
    //adds placeholder text to let user know currently hidden
    //unHideButton becomes visible since items are now hidden, only if user confirms they want to hide column
    if (window.confirm("Are you sure you would like to hide the " + column + " column?")) {
        for (let i = 0; i < tableData.length; i++) {
            tableData[i].classList.add("hidden");
        }

        //disabling the form input for the hidden columns
        let formInputToHide = document.querySelector(idName);
        formInputToHide.setAttribute("disabled", "");
        formInputToHide.setAttribute("placeholder", "currently hidden");

        //once Hide() runs and turns columns invisible, makes unHide button visible
        unHideBtn.style.display = 'block';
    }

}

//gets all table header elements
let tableHead = document.querySelectorAll("th");
//adds click listeners to all but the first row (title is required) and the last row (removable must stay)
for (let i = 1; i < tableHead.length - 1; i++) {
    tableHead[i].addEventListener("click", function() {
        let columnName = tableHead[i].classList;
        hide(columnName);
    });
}

//TODO add a UnHide() function that changes all visibility back to normal view
function unHide() {
    //tableHead[i] is cycling through the columns aside from Title and Removable
    for (let i = 1; i < tableHead.length - 1; i++) {
        if (tableHead[i].classList.contains("hidden")) {
            tableHead[i].classList.remove("hidden");
        }
    }

    //unHide for table data
    let tableBodyRows = document.querySelector("tbody").children;
    for (let i = 0; i < tableBodyRows.length; i++) {
        for (let j = 0; j < tableBodyRows[i].children.length; j++) {
            let currentColumn = tableBodyRows[i].children[j];
            if (currentColumn.classList.contains("hidden")) {
                currentColumn.classList.remove("hidden");
            }
        }
    }

    //iterates through each id in hiddenList to remove disabled attribute and reset placeholder to 'enter value here'
    for (let i = 0; i < hiddenList.length; i++) {
        let unHideElement = document.querySelector(hiddenList[i]);
        unHideElement.removeAttribute("disabled");
        unHideElement.setAttribute("placeholder", "enter value here");
    }

    //resets hiddenList
    hiddenList = [];

    //once everything is visible on screen, hides the unhide button again
    unHideBtn.style.display = "none";
}

unHideBtn.addEventListener("click", function() {
    unHide();
});
