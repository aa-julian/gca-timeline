class ButtonHandlers {
    constructor() {
        this.searchModal = new coreui.Modal(document.getElementById('search-modal'));
        this.busyIcon = document.getElementById('busy-icon');
        this.searchBtn = document.getElementById('search');
        this.cancelBtn = document.getElementById('cancel');
        this.updateBtn = document.getElementById('update');
        this.covidSwitch = document.getElementById('covid-switch');
        this.battlesCheck = document.getElementById('battles-check');
        this.explosionsCheck = document.getElementById('explosions-check');
        this.protestsCheck = document.getElementById('protests-check');
        this.riotsCheck = document.getElementById('riots-check');
        this.strategicCheck = document.getElementById('strategic-check');
        this.violenceCheck = document.getElementById('violence-check');
    }
    toggleBusy() {
        this.busyIcon.classList.toggle('invisible');
        this.searchBtn.disabled = !this.searchBtn.disabled;
    }

    init() {
        // turn off busy indicator and detail by default
        this.busyIcon.classList.toggle('invisible');

        // modal actions
        this.searchBtn.onclick = () => {
            this.searchModal.show();
        };
        this.cancelBtn.onclick = () => {
            this.searchModal.hide();
        };
        this.updateBtn.onclick = () => {
           // fsi_polygon_get();
            this.searchModal.hide();
        };

    }
}

const btnHandlers = new ButtonHandlers();
btnHandlers.init();