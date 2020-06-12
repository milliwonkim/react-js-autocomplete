import { getNames } from "country-list";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import "./styles.scss";

const countries = getNames();

function App() {
  const textRef = useRef(null);
  const itemsEl = useRef(null);
  const currentEl = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [showItems, setShowItems] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showClearButton, setShowClearButton] = useState(false);
  const clearClassList = `input__clear${showClearButton ? " show" : ""}`;

  useEffect(
    () => {
      if (itemsEl.current && currentEl.current) {
        const {
          bottom: itemsBottom,
          top: itemsTop
        } = itemsEl.current.getBoundingClientRect();
        const {
          bottom: currentBottom,
          top: currentTop
        } = currentEl.current.getBoundingClientRect();
        if (currentTop >= itemsBottom - 16) {
          currentEl.current.scrollIntoView({
            behavior: "smooth",
            block: "end"
          });
        } else if (currentBottom <= itemsTop + 16) {
          currentEl.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    },
    [currentIndex]
  );

  const handleItemClick = e => {
    setInputValue(e.target.innerHTML);
    setShowItems(false);
    if (textRef.current) {
      textRef.current.focus();
      const curPos = textRef.current.value.length;
      textRef.current.setSelectionRange(curPos, curPos);
    }
  };

  const autocompleteItems = countries
    .filter(country =>
      country.toUpperCase().startsWith(inputValue.toUpperCase())
    )
    .map((country, index) => {
      const id = country.replace(/ /g, "");
      let classList = ["input__autocomplete-item"];
      if (index === currentIndex) {
        classList.push("selected");
      }
      return (
        <li
          ref={index === currentIndex ? currentEl : null}
          key={id}
          id={id}
          className={classList.join(" ")}
          title={country}
          onClick={handleItemClick}
        >
          {country}
        </li>
      );
    });

  const handleInputKeyDown = e => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
        break;
      case "ArrowDown":
        if (currentIndex < autocompleteItems.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
        break;
      case "Enter":
        if (currentEl.current) {
          setInputValue(currentEl.current.innerHTML);
          setShowItems(false);
        }
        break;
      case "Escape":
        setShowItems(false);
        setCurrentIndex(-1);
        break;
      case "PageDown":
        if (currentIndex + 5 > autocompleteItems.length - 1) {
          setCurrentIndex(autocompleteItems.length - 1);
        } else if (currentIndex < 0) {
          setCurrentIndex(5);
        } else {
          setCurrentIndex(currentIndex + 5);
        }
        break;
      case "PageUp":
        if (currentIndex - 5 < 1) {
          setCurrentIndex(0);
        } else {
          setCurrentIndex(currentIndex - 5);
        }
        break;
      case "Tab":
        setShowItems(false);
        setCurrentIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleInputChange = e => {
    const val = e.target.value;
    if (val) {
      setInputValue(e.target.value);
      setShowItems(true);
      setCurrentIndex(-1);
      setShowClearButton(true);
    } else {
      setInputValue("");
      setShowItems(false);
      setCurrentIndex(-1);
      setShowClearButton(false);
    }
  };

  const handleClearClick = e => {
    setInputValue("");
    setShowItems(false);
    setCurrentIndex(-1);
    setShowClearButton(false);
    if (textRef.current) {
      textRef.current.focus();
    }
  };

  return (
    <div className="App">
      <div className="input__group">
        <input
          ref={textRef}
          type="text"
          id="country"
          className="input__text"
          placeholder="Country"
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          value={inputValue}
        />
        <button className={clearClassList} onClick={handleClearClick}>
          <i className="fas fa-times-circle" />
        </button>
        <ul
          ref={itemsEl}
          id="input-ac-items"
          className="input__autocomplete-items"
        >
          {showItems ? autocompleteItems : null}
        </ul>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
