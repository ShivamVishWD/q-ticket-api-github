const helper = {
    randomNumber : (minlength = 3, maxlength = 6) => {
        const generatedNumbers = new Set();

        // Generate random number within the specified length range
        const randomNumberLength = Math.floor(Math.random() * (maxlength - minlength + 1)) + minlength;

        let randomNumber = '';
        do {
            // Generate a random digit
            const digit = Math.floor(Math.random() * 10);

            // Append the digit to the random number
            randomNumber += digit;

            // Check if the random number is of desired length
            if (randomNumber.length === randomNumberLength) {
                // Check uniqueness, if already generated, regenerate the number
                if (!generatedNumbers.has(randomNumber)) {
                    // Add the generated number to the set
                    generatedNumbers.add(randomNumber);
                    // Return the generated number
                    return String(randomNumber).padStart(6,'0');
                } else {
                    // Reset the random number
                    randomNumber = '';
                }
            }
        } while (true); // Loop until a unique random number is generated
    }
}

module.exports = helper;