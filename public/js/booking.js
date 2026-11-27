const sessions = document.querySelectorAll("[data-booking-session]");

if (sessions.length) sessions[0].setAttribute("aria-current", "true");

sessions.forEach((session) => {
    session.addEventListener("click", (event) => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        sessions.forEach((item) => item.removeAttribute("aria-current"));
        session.setAttribute("aria-current", "true");
        document.getElementById("calendar").scrollIntoView();
    });
});
