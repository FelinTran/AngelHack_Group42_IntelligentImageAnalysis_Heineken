function navigateTo(url) {
    window.Location.href = url;
}

// Adding event listeners to buttons for navigation
document.getElementById("count-beer-drinkers-btn").addEventListener("click", function () {
    navigateTo("/count_beer_drinkers");
});

document.getElementById("detect-emotions-btn").addEventListener("click", function () {
    navigateTo("/detect_emotions");
});

document.getElementById("track-staff-btn").addEventListener("click", function () {
    navigateTo("/track_staff");
});

document.getElementById("grade-store-presence-btn").addEventListener("click", function () {
    navigateTo("/grade_store_presence");
});

document.getElementById("detect-posm-btn").addEventListener("click", function () {
    navigateTo("/detect_posm");
});