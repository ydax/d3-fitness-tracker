// store DOM elements in variables we'd like to be interactive
const btns = document.querySelectorAll('button'); // querySelectorAll grabs ALL the button elements, not just the first
const form = document.querySelector('form');
const formAct = document.querySelector('form span'); // reference the span element
const input = document.querySelector('input'); // reference the form input
const error = document.querySelector('.error'); // reference the error text below the form

var activity = 'cycling';

// cycle through the buttons and add a click event listener
btns.forEach(btn => {
    btn.addEventListener('click', e => {

        // get the 'activity' from the data-activity tag we set up
        activity = e.target.dataset.activity;

        // cycle through the buttons and, if class is 'active', remove it
        btns.forEach(btn => btn.classList.remove('active'));
        // apply the active class to the clicked button
        e.target.classList.add('active');

        // set id of input field
        input.setAttribute('id', activity);

        // set the text of the span in the form
        formAct.textContent = activity;
    });
});


// what happens on form submit
form.addEventListener('submit', e => {
    // prevent default action b/c by default, a submission reloads the page
    e.preventDefault();

    // convert the string number into a proper integer
    const distance = parseInt(input.value);
    if (distance) {
        db.collection('activities').add({
            distance, // this would be distance: distance, but es6+ can recognize this automatically
            activity, // this would be activity: activity, but es6+ recoginzes this
            date: new Date().toString()
        }).then(() => { // what happens after the submission was successful to the db
            error.textContent = '';
            input.value = '';
        })
    } else {
        error.textContent = 'Please enter a valid distance'
    }
});