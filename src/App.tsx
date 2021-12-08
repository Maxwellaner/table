import { useEffect, useState } from 'react';
import './App.css';

import tableColumns from './tableColumns/columns.json';
import data from './tableColumns/data.json';

type Key = 'n_client' | 'client' | 'qty_chargeback' | 'value_chargeback' | 'qty_sales' | 'total_value' | 'percent_chargeback' | 'percent_total_chargeback';

function App() {
  const [columns, setColumns] = useState(() => tableColumns);
  const [pattern, setPattern] = useState(true);
  const [fiftyLines, setFiftyLines] = useState(false);
  const [page, setPage] = useState(1);
  const [paginatedArray, setPaginatedArray] = useState<typeof data>([]);
  const [numPages, setNumPages] = useState(0);

  const numLines = 50;

  useEffect(() => {
    setNumPages(Math.ceil(data.length / 50));

    const offset = page * numLines;
    setPaginatedArray(data.slice(offset - numLines, offset));
    console.log('numPages', numPages);
  }, [page])

  return (
    <div className="vw-100 vh-100 container d-flex flex-column justify-content-center align-items-center">
      <div className="mb-2 table-wrapper-scroll-y custom-scrollbar">
        <table className="table table-striped table-hover table-borderless table-responsive">
          <thead>
            <tr>
              {Object.entries(columns).map(([key, value]) => {
                if (value.active) return <th key={value.title} className={value.classname}>{value.title}</th>
              })}
              <th>
                <div className="dropdown">
                  <div className="dots" id="menu-filter" data-bs-toggle="dropdown" aria-expanded="false">
                    . . .
                  </div>
                  <ul className="dropdown-menu" aria-labelledby="menu-filter">
                    <li>Linhas por página</li>
                    <li>
                      <label>
                        <input onChange={() => {
                          setPattern(!pattern);
                          setFiftyLines(false);
                        }} type="checkbox" checked={pattern} />
                        Padrão
                      </label>
                    </li>
                    <li>
                      <label>
                        <input onChange={() => {
                          setPattern(false);
                          setFiftyLines(!fiftyLines);
                        }} type="checkbox" checked={fiftyLines} />
                        50 linhas
                      </label>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>Colunas</li>
                    {Object.entries(columns).map(([column, value]) => {
                      return (
                        <li key={value.title}>
                          <label>
                            <input onChange={() => {
                              setColumns(prev => {
                                return {
                                  ...prev,
                                  [column]: {
                                    title: value.title,
                                    classname: value.classname,
                                    active: !value.active
                                  }
                                }
                              })
                            }} type="checkbox" checked={value.active} />
                            {value.title}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {pattern ? (
              data.map(item => {
                return (
                  <tr>
                    {Object.entries(columns).map(([key, value]) => {
                      if (value.active) return <td className={value.classname}><span className={value.classname.includes('red') ? 'arrow' : ''}>{item[key as Key]}</span></td>
                    })}
                    <td></td>
                  </tr>
                )
              })
            ) : (
              paginatedArray?.map(item => {
                return (
                  <tr>
                    {Object.entries(columns).map(([key, value]) => {
                      if (value.active) return <td className={value.classname}><span className={value.classname.includes('red') ? 'arrow' : ''}>{item[key as Key]}</span></td>
                    })}
                    <td></td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      {!pattern && (
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li onClick={() => {
              if (page > 1) setPage(page - 1);
            }} className="page-item">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            {
              [...Array(numPages + 1)].map((item, index) => {
                if (index !== 0)
                  if (index >= page - 2 && index <= page + 2)
                    return <li onClick={() => setPage(index)} className={`page-item ${page === index ? 'active' : ''}`}><a className="page-link" href="#">{index}</a></li>
              })
            }
            <li onClick={() => {
              if (page < 20) setPage(page + 1)
            }} className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default App;
