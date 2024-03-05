// Function to check the players code and provide a hint 
function codeHint() {
    let hint = '';
      for (let i = 0; i < codeArray.length; i++) {
        const digit = codeArray[i];
        const position = buttonArray.indexOf(digit);
          if (position !== -1 && position === i) {
              hint += digit // Correct digit and position 
          } else {
              hint += '*' // Incorrect digit
        }
      }
      console.log('Hint: ' + hint);
  }