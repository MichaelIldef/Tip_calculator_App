    // ---------------- INPUT ---------------- //
    const billInput = document.querySelector("#bill-input");

    const tipInputOptions = document.querySelectorAll(".card__tip-option");
    const tipInputBtns = document.querySelectorAll(".card__tip-option--fixed");
    const tipInputCustom = document.querySelector("#tip-custom-input");
    
    const numberOfPeopleInput = document.querySelector("#number-of-people-input");
    
    const inputs = [billInput, numberOfPeopleInput];
        // ---------------------------------------- //
    
    
        // ---------------- HOLDERS ---------------- //
    
    const peopleErrorMessage = document.querySelector(".card__people--input-error");
    
    let selectedTipButton = null;
    let selectedTipCustom = null;
    
        // ----------------------------------------- //
    
    
        // ---------------- OUTPUT ---------------- //
    const tipAmountPerPersonOutput = document.querySelector("#tip-amount-output");
    const totalPricePerPersonOutput = document.querySelector("#tip-total-output");
    
    const resetBtn = document.querySelector(".card__reset-btn");
        // ---------------------------------------- //
    
    // -------------------------------------------------- //
    
    
    // -------------------- MAIN -------------------- //
    
    tipInputBtns.forEach(btn => btn.addEventListener("click", handleTipButtonOptionSelection));
    tipInputCustom.addEventListener("click", handleTipCustomOptionSelected);
    inputs.forEach(input => {
        input.addEventListener("keypress", allowOnlyPositiveFloatInput)
        input.addEventListener("input", enforceInputMaxLength);
    });
    resetBtn.addEventListener("click", handleResetButtonSelection);
    setInterval(calculateTip);
    
    // ---------------------------------------------- //
    
    
    // -------------------- FUNCTIONS -------------------- //
    
    function calculateTip() {
        if (isThereInputError()) {
            displayErrorMessage();
            return;
        }
        else {
            hideErrorMessage();
        }
    
        if (hasUserInputtedAllFields()) {
            const billPrice = parseFloat(billInput.value);
            const numberOfPeople = parseInt(numberOfPeopleInput.value);
            const tipPercent = parseInt((selectedTipButton !== null) ? selectedTipButton.innerHTML : selectedTipCustom.value);
            const billPricePerPerson = billPrice / numberOfPeople;
    
            const tipAmountPerPerson = billPricePerPerson * (tipPercent / 100);
            const totalPricePerPerson = billPricePerPerson + tipAmountPerPerson;
    
            updateOutput(tipAmountPerPerson, totalPricePerPerson);
        }
        else {
            clearOutputs();
        }
    }
    
    function handleTipButtonOptionSelection(event) {
        if (!isThereAnySelectedTipOption()) {
            saveSelectedTipButton(event.target);
            return;
        }
    
        if (isTipCustomSelected()) {
            deselectSelectedTipCustom();
            saveSelectedTipButton(event.target);
            return;
        }
        
        // At this point there must be a selected tip button (two previous if statements failed...)
    
        if (hasSelectedAnAlreadySelectedTipButton(event.target)) {
            deselectSelectedTipButton();
        }
        else {
            deselectSelectedTipButton();
            saveSelectedTipButton(event.target);
        }
    }
    
    function handleTipCustomOptionSelected(event) {
        if (!isThereAnySelectedTipOption()) {
            selectedTipCustom = event.target;
            return;
        }
    
        if (isTipCustomSelected()) {
            return;
        }
    
    
        deselectSelectedTipButton();
        selectedTipCustom = event.target;
    }
    
    function handleTipOptionSelection(event) {
        const selectedOption = event.target;
    
        if (selectedOption.classList.contains("selected-tip-option")) {
            deselectAllTipOptions();
        }
        else {
            deselectAllTipOptions(); // change!!!
            if (selectedOption in tipInputBtns) {
                selectedOption.classList.add("selected-tip-option");
            }
        }
    }
    
    function handleResetButtonSelection() {
        clearInputs();
        clearOutputs();
    }
    
    function deselectSelectedTipButton() {
        selectedTipButton.classList.remove("selected-tip-option");
        selectedTipButton = null;
    }
    
    function deselectSelectedTipCustom() {
        selectedTipCustom.value = "";
        selectedTipCustom = null;
    }
    
    function isThereAnySelectedTipButton() {
        return selectedTipButton !== null;
    }
    
    function isTipCustomSelected() {
        return selectedTipCustom !== null;
    }
    
    function isThereAnySelectedTipOption() {
        return isThereAnySelectedTipButton() || isTipCustomSelected();
    }
    
    function hasSelectedAnAlreadySelectedTipButton(currentlySelectedTipButton) {
        return selectedTipButton === currentlySelectedTipButton;
    }
    
    function saveSelectedTipButton(tipButton) {
        selectedTipButton = tipButton;
        selectedTipButton.classList.add("selected-tip-option");
    }
    
    function saveSelectedTipCustom() {
        selectedTipCustom = tipInputCustom;
    }
    
    function updateOutput(tipAmountPerPerson, totalPricePerPerson) {
        tipAmountPerPersonOutput.value = "$" + tipAmountPerPerson.toFixed(2);
        totalPricePerPersonOutput.value = "$" + totalPricePerPerson.toFixed(2);
    }
    
    function clearInputs() {
        billInput.value = "";
        numberOfPeopleInput.value = "";
        
        if (isThereAnySelectedTipButton()) {
            deselectSelectedTipButton();
        }
    
        if (isTipCustomSelected()) {
            deselectSelectedTipCustom();
        }
    }
    
    function clearOutputs() {
        tipAmountPerPersonOutput.value = "$0.00";
        totalPricePerPersonOutput.value = "$0.00";
    }
    
    function hasUserInputtedAllFields() {
        if (numberOfPeopleInput.value === "") {
            return false;
        }
    
        if (billInput.value === "") {
            return false;
        }
    
        if ((selectedTipButton === null) && ((selectedTipCustom === null) || (selectedTipCustom.value === ""))) {
            return false;
        }
    
        return true;
    }
    
    function getTipPercent() {
        if (selectedTipButton !== null) {
            return parseInt(selectedTipButton.value.substring(0, selectedTipButton.value.indexOf('%')));
        }
        return parseInt(selectedTipCustom.value);
    }
    
    function isThereInputError() {
        return numberOfPeopleInput.value === "0";
    }
    
    function displayErrorMessage() {
        peopleErrorMessage.classList.remove("hidden");
        
        if (!numberOfPeopleInput.classList.contains("error")) {
            numberOfPeopleInput.classList.add("error");;
        }
    }
    
    function hideErrorMessage() {
        if (!numberOfPeopleInput.classList.contains("hidden")) {
            peopleErrorMessage.classList.add("hidden");
        }
        
        numberOfPeopleInput.classList.remove("error");
    }
    
    function allowOnlyPositiveFloatInput(event) {
        return (event.charCode != 8 && event.charCode == 0 || (event.charCode >= 48 && event.charCode <= 57));
    }
    
    function enforceInputMaxLength(event) {
        const input = event.target;
    
        if (input.value.length > input.maxLength) {
            input.value = input.value.slice(0, input.maxLength);
        }
    }
    