import React, { useState, useEffect } from 'react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [theme, setTheme] = useState(1);

  // Theme configurations
  const themes = {
    1: {
      mainBg: 'hsl(222, 26%, 31%)',
      toggleBg: 'hsl(223, 31%, 20%)',
      screenBg: 'hsl(224, 36%, 15%)',
      keyBg: 'hsl(30, 25%, 89%)',
      keyShadow: 'hsl(28, 16%, 65%)',
      specialKeyBg: 'hsl(225, 21%, 49%)',
      specialKeyShadow: 'hsl(224, 28%, 35%)',
      equalsKeyBg: 'hsl(6, 63%, 50%)',
      equalsKeyShadow: 'hsl(6, 70%, 34%)',
      textPrimary: 'hsl(221, 14%, 31%)',
      textSecondary: 'hsl(0, 0%, 100%)',
      textDisplay: 'hsl(0, 0%, 100%)'
    },
    2: {
      mainBg: 'hsl(0, 0%, 90%)',
      toggleBg: 'hsl(0, 5%, 81%)',
      screenBg: 'hsl(0, 0%, 93%)',
      keyBg: 'hsl(45, 7%, 89%)',
      keyShadow: 'hsl(35, 11%, 61%)',
      specialKeyBg: 'hsl(185, 42%, 37%)',
      specialKeyShadow: 'hsl(185, 58%, 25%)',
      equalsKeyBg: 'hsl(25, 98%, 40%)',
      equalsKeyShadow: 'hsl(25, 99%, 27%)',
      textPrimary: 'hsl(60, 10%, 19%)',
      textSecondary: 'hsl(0, 0%, 100%)',
      textDisplay: 'hsl(60, 10%, 19%)'
    },
    3: {
      mainBg: 'hsl(268, 75%, 9%)',
      toggleBg: 'hsl(268, 71%, 12%)',
      screenBg: 'hsl(268, 71%, 12%)',
      keyBg: 'hsl(268, 47%, 21%)',
      keyShadow: 'hsl(290, 70%, 36%)',
      specialKeyBg: 'hsl(281, 89%, 26%)',
      specialKeyShadow: 'hsl(285, 91%, 52%)',
      equalsKeyBg: 'hsl(176, 100%, 44%)',
      equalsKeyShadow: 'hsl(177, 92%, 70%)',
      textPrimary: 'hsl(52, 100%, 62%)',
      textSecondary: 'hsl(0, 0%, 100%)',
      textDisplay: 'hsl(52, 100%, 62%)'
    }
  };

  const currentTheme = themes[theme];

  // Initialize theme from system preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      setTheme(1);
    } else {
      setTheme(2);
    }
  }, []);

  const inputNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const deleteLast = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case 'x':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 3 ? 1 : theme + 1);
  };

  const formatDisplay = (value) => {
    if (value.length > 12) {
      return parseFloat(value).toExponential(6);
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={{ backgroundColor: currentTheme.mainBg }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 
            className="text-2xl font-bold"
            style={{ color: currentTheme.textDisplay }}
          >
            calc
          </h1>
          <div className="flex items-center gap-4">
            <span 
              className="text-sm font-bold"
              style={{ color: currentTheme.textDisplay }}
            >
              THEME
            </span>
            <div className="flex flex-col items-center">
              <div className="flex gap-2 mb-1">
                {[1, 2, 3].map((num) => (
                  <span 
                    key={num}
                    className="text-xs w-4 text-center"
                    style={{ color: currentTheme.textDisplay }}
                  >
                    {num}
                  </span>
                ))}
              </div>
              <div 
                className="relative w-14 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300"
                style={{ backgroundColor: currentTheme.toggleBg }}
                onClick={toggleTheme}
              >
                <div 
                  className="w-4 h-4 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: currentTheme.equalsKeyBg,
                    transform: `translateX(${(theme - 1) * 16}px)`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Display */}
        <div 
          className="w-full h-20 rounded-lg mb-6 flex items-center justify-end px-6 text-right transition-colors duration-300"
          style={{ backgroundColor: currentTheme.screenBg }}
        >
          <div 
            className="text-3xl font-bold truncate"
            style={{ color: currentTheme.textDisplay }}
          >
            {formatDisplay(display)}
          </div>
        </div>

        {/* Keypad */}
        <div 
          className="p-6 rounded-lg grid grid-cols-4 gap-4 transition-colors duration-300"
          style={{ backgroundColor: currentTheme.toggleBg }}
        >
          {/* Row 1 */}
          <button
            onClick={() => inputNumber(7)}
            className="h-14 rounded-lg font-bold text-2xl transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.keyBg,
              color: currentTheme.textPrimary,
              boxShadow: `0 4px 0 ${currentTheme.keyShadow}`
            }}
          >
            7
          </button>
          <button
            onClick={() => inputNumber(8)}
            className="h-14 rounded-lg font-bold text-2xl transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.keyBg,
              color: currentTheme.textPrimary,
              boxShadow: `0 4px 0 ${currentTheme.keyShadow}`
            }}
          >
            8
          </button>
          <button
            onClick={() => inputNumber(9)}
            className="h-14 rounded-lg font-bold text-2xl transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.keyBg,
              color: currentTheme.textPrimary,
              boxShadow: `0 4px 0 ${currentTheme.keyShadow}`
            }}
          >
            9
          </button>
          <button
            onClick={deleteLast}
            className="h-14 rounded-lg font-bold text-lg transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.specialKeyBg,
              color: currentTheme.textSecondary,
              boxShadow: `0 4px 0 ${currentTheme.specialKeyShadow}`
            }}
          >
            DEL
          </button>

          {/* Row 2 */}
          <button
            onClick={() => inputNumber(4)}
            className="h-14 rounded-lg font-bold text-2xl transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.keyBg,
              color: currentTheme.textPrimary,
              boxShadow: `0 4px 0 ${currentTheme.keyShadow}`
            }}
          >
            4
          </button>
          <button
            onClick={() => inputNumber(5)}
            className="h-14 rounded-lg font-bold text-2xl transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.keyBg,
              color: currentTheme.textPrimary,
              boxShadow: `0 4px 0 ${currentTheme.keyShadow}`
            }}
          >
            5
          </button>
          <button
            onClick={() => inputNumber(6)}
            className="h-14 rounded-lg font-bold text-2xl transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.keyBg,
              color: currentTheme.textPrimary,
              boxShadow: `0 4px 0 ${currentTheme.keyShadow}`
            }}
          >
            6
          </button>
          <button
            onClick={() => performOperation('+')}
            className="h-14 rounded-lg font-bold text-2xl transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.keyBg,
              color: currentTheme.textPrimary,
              boxShadow: `0 4px 0 ${currentTheme.keyShadow}`
            }}
          >
            +
          </button>

          {/* Row 3 */}
          <button
            onClick={() => inputNumber(1)}
            className="h-14 rounded-lg font-bold text-2xl transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.keyBg,
              color: currentTheme.textPrimary,
              boxShadow: `0 4px 0 ${currentTheme.keyShadow}`
            }}
          >
            1
          </button>
          <button
            onClick={() => inputNumber(2)}
            className="h-14 rounded-lg font-bold text-2xl transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.keyBg,
              color: currentTheme.textPrimary,
              boxShadow: `0 4px 0 ${currentTheme.keyShadow}`
            }}
          >
            2
          </button>
          <button
            onClick={() => inputNumber(3)}
            className="h-14 rounded-lg font-bold text-2xl transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.keyBg,
              color: currentTheme.textPrimary,
              boxShadow: `0 4px 0 ${currentTheme.keyShadow}`
            }}
          >
            3
          </button>
          <button
            onClick={() => performOperation('-')}
            className="h-14 rounded-lg font-bold text-2xl transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.keyBg,
              color: currentTheme.textPrimary,
              boxShadow: `0 4px 0 ${currentTheme.keyShadow}`
            }}
          >
            -
          </button>

          {/* Row 4 */}
          <button
            onClick={inputDecimal}
            className="h-14 rounded-lg font-bold text-2xl transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.keyBg,
              color: currentTheme.textPrimary,
              boxShadow: `0 4px 0 ${currentTheme.keyShadow}`
            }}
          >
            .
          </button>
          <button
            onClick={() => inputNumber(0)}
            className="h-14 rounded-lg font-bold text-2xl transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.keyBg,
              color: currentTheme.textPrimary,
              boxShadow: `0 4px 0 ${currentTheme.keyShadow}`
            }}
          >
            0
          </button>
          <button
            onClick={() => performOperation('/')}
            className="h-14 rounded-lg font-bold text-2xl transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.keyBg,
              color: currentTheme.textPrimary,
              boxShadow: `0 4px 0 ${currentTheme.keyShadow}`
            }}
          >
            /
          </button>
          <button
            onClick={() => performOperation('x')}
            className="h-14 rounded-lg font-bold text-2xl transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.keyBg,
              color: currentTheme.textPrimary,
              boxShadow: `0 4px 0 ${currentTheme.keyShadow}`
            }}
          >
            x
          </button>

          {/* Row 5 */}
          <button
            onClick={clear}
            className="h-14 rounded-lg font-bold text-lg col-span-2 transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.specialKeyBg,
              color: currentTheme.textSecondary,
              boxShadow: `0 4px 0 ${currentTheme.specialKeyShadow}`
            }}
          >
            RESET
          </button>
          <button
            onClick={handleEquals}
            className="h-14 rounded-lg font-bold text-lg col-span-2 transition-all duration-150 hover:brightness-110 active:translate-y-1"
            style={{ 
              backgroundColor: currentTheme.equalsKeyBg,
              color: theme === 3 ? currentTheme.textPrimary : currentTheme.textSecondary,
              boxShadow: `0 4px 0 ${currentTheme.equalsKeyShadow}`
            }}
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;