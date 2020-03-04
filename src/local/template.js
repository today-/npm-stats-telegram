const fs = require('fs');

const styles = fs.readFileSync(__dirname + '/styles.css');

module.exports = (packages) => {
    return `<html lang="en">
      <body>
        <style>
          ${styles}
        </style>

        <div id="content">
          ${packages.map(stats => `
            <div class="one-block-container">
              <div class="autocomplete-input-box">
                <form class="autocomplete-input__form">
                  <div class="autocomplete-input__container result-page__search-input">
                    <div style="display: inline-block; width: 100%; position: relative;">
                      <input aria-autocomplete="list"
                             aria-expanded="false"
                             autocapitalize="off" autocomplete="off"
                             autocorrect="off" class="autocomplete-input"
                             placeholder="find package"
                             role="combobox"
                             spellcheck="false"
                             value="${stats.name}@${stats.version}">
                    </div>
                    <div class="autocomplete-input__dummy-input">
                      <span class="dummy-input__package-name">${stats.name}</span>
                      <span
                          class="dummy-input__at-separator">@</span><span
                        class="dummy-input__package-version">${stats.version}</span></div>
                  </div>
                </form>
                <div class="autocomplete-input-box__footer">
                  <div class="quick-stats-bar">
                    <div class="quick-stats-bar__stat quick-stats-bar__stat--description " title="">
                      <svg height="10" viewBox="0 0 7 10" width="7" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" fill-rule="evenodd">
                          <path d="M.126 8.46H2.59V4.54H.126V3H4.41v5.46H7V10H.126z" fill="#C8CDD3"></path>
                          <path
                              d="M2.254 1.096a.99.99 0 0 1 .322-.742c.215-.205.513-.308.896-.308.392 0 .705.103.938.308.233.205.35.453.35.742a.908.908 0 0 1-.35.735c-.233.191-.546.287-.938.287-.383 0-.681-.096-.896-.287a.94.94 0 0 1-.322-.735z"
                              fill="#90DD97"></path>
                        </g>
                      </svg>
                      <span class="quick-stats-bar__stat--description-content" style="max-width: 500px;">
                                  ${stats.description}
                                </span>
                    </div>
                    <div class="quick-stats-bar__stat quick-stats-bar__stat--optional">
                      <svg class="quick-stats-bar__stat-icon" height="18" viewBox="0 0 20 18" width="20"
                           xmlns="http://www.w3.org/2000/svg"><title>Group 11</title>
                        <g fill="none" fill-rule="nonzero">
                          <path
                              d="M9.563 9a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm0-1.125a3.375 3.375 0 1 0 0-6.75 3.375 3.375 0 0 0 0 6.75zM9.563 18a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm0-1.125a3.375 3.375 0 1 0 0-6.75 3.375 3.375 0 0 0 0 6.75z"
                              fill="#C8CDD3"></path>
                          <path
                              d="M14.625 13.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm0-1.125a3.375 3.375 0 1 0 0-6.75 3.375 3.375 0 0 0 0 6.75zM4.5 13.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm0-1.125a3.375 3.375 0 1 0 0-6.75 3.375 3.375 0 0 0 0 6.75z"
                              fill="#C8CDD3"></path>
                          <path
                              d="M9.563 13.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm0-1.125a3.375 3.375 0 1 0 0-6.75 3.375 3.375 0 0 0 0 6.75z"
                              fill="#90DD97"></path>
                          <circle cx="9.563" cy="9" fill="#FFF" r="3.375"></circle>
                        </g>
                      </svg>
                      <span><span>${stats.dependencyCount} dependencies</span></span></div>
                  </div>
                </div>
              </div>

              <div class="content-split-container">
                <div class="stats-container">

                  <div class="size-container"><h3> Bundle Size </h3>
                    <div class="size-stats">
                      <div class="stat-container">
                        <div class="stat-container__value-container">
                          <div class="stat-container__value-wrap">
                            <div class="stat-container__value size">${stats.size[0]}</div>
                          </div>
                          <div class="stat-container__unit">${stats.size[1]}</div>
                        </div>
                        <div class="stat-container__divider"></div>
                        <div class="stat-container__footer">
                          <div class="stat-container__label">Minified</div>
                        </div>
                      </div>
                      <div class="stat-container">
                        <div class="stat-container__value-container">
                          <div class="stat-container__value-wrap">
                            <div class="stat-container__value size">${stats.gzip[0]}</div>
                          </div>
                          <div class="stat-container__unit">${stats.gzip[1]}</div>
                        </div>
                        <div class="stat-container__divider"></div>
                        <div class="stat-container__footer">
                          <div class="stat-container__label">Minified + Gzipped</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="size-container"><h3> Weekly Downloads</h3>
                    <div class="size-stats smaller-stats">
                      <div class="stat-container">
                        <div class="stat-container__value-container">
                          <div class="stat-container__value-wrap">
                            <div class="stat-container__value time">${stats.downloads}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="size-container"><h3> Last publish </h3>
                    <div class="size-stats smaller-stats">
                      <div class="stat-container">
                        <div class="stat-container__value-container">
                          <div class="stat-container__value-wrap">
                            <div class="stat-container__value time">${stats.updated}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="size-container"><h3> Stars </h3>
                    <div class="size-stats smaller-stats">

                      <div class="stat-container">
                        <div class="stat-container__value-container">
                          <div class="stat-container__value-wrap">
                            <div class="stat-container__value time">${stats.stars}</div>
                          </div>
                          <div class="stat-container__unit">stars</div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </body>
    </html>`
};

