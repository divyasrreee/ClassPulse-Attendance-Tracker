
/* =====================================
   CLASSPULSE - OVERALL ATTENDANCE
===================================== */

const attendanceForm = document.getElementById("attendanceForm");

const totalInput = document.getElementById("total");
const attendedInput = document.getElementById("attended");
const targetInput = document.getElementById("target");

const calculatorError = document.getElementById("calculatorError");
const summarySection = document.getElementById("summarySection");

function isValidWholeNumber(value) {
    return value.trim() !== "" &&
        Number.isFinite(Number(value)) &&
        Number.isInteger(Number(value));
}

attendanceForm.addEventListener("submit", function (event) {
    event.preventDefault();

    calculatorError.textContent = "";

    const totalValue = totalInput.value;
    const attendedValue = attendedInput.value;
    const targetValue = targetInput.value;

    if (
        !isValidWholeNumber(totalValue) ||
        !isValidWholeNumber(attendedValue) ||
        !isValidWholeNumber(targetValue)
    ) {
        calculatorError.textContent =
            "Please enter valid whole numbers in all fields.";
        return;
    }

    const total = Number(totalValue);
    const attended = Number(attendedValue);
    const target = Number(targetValue);

    if (total <= 0) {
        calculatorError.textContent =
            "Total classes must be greater than zero.";
        return;
    }

    if (attended < 0 || attended > total) {
        calculatorError.textContent =
            "Attended classes must be between 0 and total classes.";
        return;
    }

    if (target < 1 || target > 100) {
        calculatorError.textContent =
            "Target attendance must be between 1% and 100%.";
        return;
    }

    // Calculate overall attendance
    const percentage = (attended / total) * 100;
    const missed = total - attended;

    document.getElementById("summaryPercentage").textContent =
        percentage.toFixed(2) + "%";

    document.getElementById("summaryAttended").textContent =
        attended;

    document.getElementById("summaryMissed").textContent =
        missed;

    document.getElementById("summaryTarget").textContent =
        target + "%";

    const summaryStatus = document.getElementById("summaryStatus");

    summaryStatus.className = "summary-status";

    if (percentage >= target) {
        summaryStatus.classList.add("status-success");
        summaryStatus.textContent =
            "Great! Your attendance is meeting your target.";
    } else {
        summaryStatus.classList.add("status-warning");

        if (target === 100) {
            summaryStatus.textContent =
                "You are below your 100% target. You cannot reach 100% by attending future classes alone because some classes have already been missed.";
        } else {
            const requiredClasses = Math.ceil(
                (target * total - 100 * attended) / (100 - target)
            );

            summaryStatus.textContent =
                "Your attendance is below your target. " +
                "Attend the next " + Math.max(0, requiredClasses) +
                " consecutive classes without missing any to reach your target.";
        }
    }

    summarySection.hidden = false;

    summarySection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});


/* =====================================
   CLASSPULSE - SUBJECT-WISE ATTENDANCE
===================================== */

const subjectDetails = [
    { id: "java" },
    { id: "dbms" },
    { id: "fullstack" },
    { id: "cn" },
    { id: "os" }
];

function calculateSubjectAttendance(subject) {
    const totalElement = document.getElementById(
        subject.id + "Total"
    );

    const attendedElement = document.getElementById(
        subject.id + "Attended"
    );

    const percentageElement = document.getElementById(
        subject.id + "Percentage"
    );

    const progressElement = document.getElementById(
        subject.id + "Progress"
    );

    const statusElement = document.getElementById(
        subject.id + "Status"
    );

    const totalText = totalElement.value;
    const attendedText = attendedElement.value;

    const total = Number(totalText);
    const attended = Number(attendedText);

    // Check for empty or invalid inputs
    if (
        !isValidWholeNumber(totalText) ||
        !isValidWholeNumber(attendedText) ||
        total < 0 ||
        attended < 0 ||
        attended > total
    ) {
        percentageElement.textContent = "--";
        progressElement.style.width = "0%";
        progressElement.style.backgroundColor = "#9ca3af";

        if (
            isValidWholeNumber(totalText) &&
            isValidWholeNumber(attendedText) &&
            attended > total
        ) {
            statusElement.textContent =
                "Attended classes cannot exceed total classes.";
        } else {
            statusElement.textContent =
                "Enter valid whole numbers for both fields.";
        }

        statusElement.style.color = "#dc2626";
        return;
    }

    // A percentage cannot be calculated if no classes have occurred
    if (total === 0) {
        percentageElement.textContent = "0%";
        progressElement.style.width = "0%";
        progressElement.style.backgroundColor = "#9ca3af";

        statusElement.textContent =
            "Enter the total number of classes.";
        statusElement.style.color = "#6b7280";
        return;
    }

    // Calculate percentage
    const percentage = (attended / total) * 100;

    percentageElement.textContent =
        percentage.toFixed(1) + "%";

    progressElement.style.width = percentage + "%";

    // Show the status using the 75% attendance target
    if (percentage >= 75) {
        progressElement.style.backgroundColor = "#16a34a";

        statusElement.textContent =
            "You are meeting the 75% attendance target.";

        statusElement.style.color = "#15803d";
    } else {
        progressElement.style.backgroundColor = "#dc2626";

        const requiredClasses = Math.ceil(
            (75 * total - 100 * attended) / (100 - 75)
        );

        statusElement.textContent =
            "Below 75%. Attend the next " +
            Math.max(0, requiredClasses) +
            " consecutive classes to reach 75%.";

        statusElement.style.color = "#dc2626";
    }
}


// Calculate the five subjects when the page loads
subjectDetails.forEach(function (subject) {
    calculateSubjectAttendance(subject);
});


// Automatically update percentages whenever an input changes
subjectDetails.forEach(function (subject) {
    const totalElement = document.getElementById(
        subject.id + "Total"
    );

    const attendedElement = document.getElementById(
        subject.id + "Attended"
    );

    totalElement.addEventListener("input", function () {
        calculateSubjectAttendance(subject);
    });

    attendedElement.addEventListener("input", function () {
        calculateSubjectAttendance(subject);
    });
});
