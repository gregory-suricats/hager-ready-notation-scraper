'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import ClipLoader from 'react-spinners/ClipLoader';

export default function Home() {
  const [url, setUrl] = useState(
    'https://apps.microsoft.com/detail/9p4nxl0dfvf4?hl=en-us&gl='
  );
  const [tableData, setTableData] = useState<
    { country: string; notation: number }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState('#ffffff');

  const handleSubmit = () => {
    const textArea = document.querySelector('textarea');
    if (textArea) {
      const textAreaValue = textArea.value;
      setLoading(true);
      fetch('/api/getData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countries: textAreaValue, url: url }),
      })
        .then((response) => response.json())
        .then(({ data }) => {
          console.log('Received data:', data);
          setTableData(data);
          setLoading(false);
        })
        .catch((error) => setErrorMessage(error.message));
    }
  };

  return (
    <main className={styles.main}>
      <h1>Hager Ready Notation Scraper</h1>
      <legend>
        Enter here the url of the app without the country code (ex:
        https://apps.microsoft.com/detail/9p4nxl0dfvf4?hl=en-us&gl=)
      </legend>
      <input
        type="text"
        className={styles.textArea}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      ></input>
      <legend>
        Enter here the list of countries separated by commas (ex: nl, fr, es,
        pt)
      </legend>
      <textarea className={styles.textArea}></textarea>
      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={loading}
      >
        Submit
      </button>
      <ClipLoader
        color={color}
        loading={loading}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      {tableData.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Country</th>
              <th>Notation</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => (
              <tr key={index}>
                <td>{data.country}</td>
                <td>
                  {data.notation !== undefined
                    ? data.notation
                    : 'No notation found'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {errorMessage && (
        <div style={{ color: 'red', marginTop: '20px' }}>{errorMessage}</div>
      )}
    </main>
  );
}
