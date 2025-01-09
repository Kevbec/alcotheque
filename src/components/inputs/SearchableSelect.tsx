import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Search, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export default function SearchableSelect({ 
  options, 
  selected, 
  onChange,
  placeholder = "Rechercher..." 
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
        setFocusedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setFocusedIndex(search ? 0 : -1);
  }, [search]);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value]
    );
    setSearch('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          toggleOption(filteredOptions[focusedIndex].value);
          setFocusedIndex(-1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearch('');
        setFocusedIndex(-1);
        break;
      case 'Tab':
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          e.preventDefault();
          toggleOption(filteredOptions[focusedIndex].value);
          setFocusedIndex(-1);
        }
        break;
    }
  };

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const element = listRef.current.children[focusedIndex] as HTMLElement;
      if (element) {
        element.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [focusedIndex]);

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className="min-h-[48px] px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-text flex flex-wrap gap-2 items-center"
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        {selected.map(value => {
          const option = options.find(o => o.value === value);
          return (
            <span
              key={value}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
            >
              {option?.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(value);
                }}
                className="ml-1 inline-flex items-center p-0.5 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          );
        })}
        <input
          ref={inputRef}
          type="text"
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none p-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder={selected.length === 0 ? "Sélectionner des types..." : ""}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
          <ul 
            ref={listRef}
            className="max-h-60 overflow-auto py-1 text-base"
            role="listbox"
          >
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={selected.includes(option.value)}
                className={`
                  cursor-pointer select-none relative py-2 px-3
                  ${selected.includes(option.value) 
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-100' 
                    : 'text-gray-900 dark:text-gray-100'
                  }
                  ${index === focusedIndex
                    ? 'bg-indigo-100 dark:bg-indigo-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                  }
                `}
                onClick={() => toggleOption(option.value)}
              >
                {option.label}
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="py-2 px-3 text-gray-500 dark:text-gray-400">
                Aucun résultat
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}