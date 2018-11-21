(() => {
  var pages = {
    "/posts/": "https://demo.digital.gov/posts/index.json",
    "/events/": "https://demo.digital.gov/events/index.json",
    "/resources/": "https://demo.digital.gov/resources/index.json",
    "/services/": "https://demo.digital.gov/services/index.json",
    "/communities/": "https://demo.digital.gov/communities/index.json",
    "/topics/": "https://demo.digital.gov/topics/v1/json/",
    "/promos/": "https://demo.digital.gov/promos/v1/json/",
  }
  function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
  }
  if (current_page in pages) {
    fetch("https://cors-anywhere.herokuapp.com/" + pages[current_page]).then(data => {
      return data.json();
    }).then(data => {
      data = data.items;
      $("#loading").remove();

      if (current_page === "/topics/" || current_page === "/promos/") {

      } else {
        var month;
        var toAppend;
        for (var item of data) {
          toAppend = "";
          var itemDate = parseISOString(item.date_published);
          var monthName = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          ][itemDate.getMonth()];
          if (month) {
            if (itemDate.getMonth() !== month) {
              toAppend += `
                <h2>${monthName} ${itemDate.getFullYear()}</h2>
              `;
            }
          } else {
            toAppend += `
              <h2>${monthName} ${itemDate.getFullYear()}</h2>
            `;
          }
          month = itemDate.getMonth();
          toAppend += `
            <div class="grid-row grid-gap margin-bottom-205">

            <div class="tablet:grid-col margin-bottom-1">
              <article class="bg-base-lightest padding-2 padding-bottom-${item.topics ? "0" : "105"}">
                <h3 class="margin-0"><a href="${source_of_truth}${item.url}" class="text-base-darkest underline-primary-light text-underline">${item.title}</a></h3>
                <h4 class="margin-top-0 margin-bottom-1 text-normal text-uppercase text-base-darker">${item.date_published}</h4>
                <p class="margin-0">${item.summary}</p>
          `;
          if (item.topics) {
            toAppend += `
                <div class="margin-top-105 padding-bottom-1">
            `;
            for (var topic in item.topics) {
              toAppend += `
                  <span class="usa-tag margin-bottom-1 display-inline-block">${item.topics[topic]}</span>
              `;
            }
            toAppend += `
                </div>
            `;
          }
          toAppend += `
              </article>
            </div>

            <div class="tablet:grid-col-auto">
              <a href="${item.editpathURL}" class="usa-button margin-bottom-1" target="_blank">Edit</a>
              <a href="${base_url}/edit-topics/?page=${source_of_truth + item.url}" class="usa-button usa-button-outline margin-bottom-1">Edit
                topics</a>
              <a target="_blank" href="https://digital.gov${item.url}" class="usa-button usa-button-outline" target="_blank">Live</a>
            </div>

            </div>
          `;
          $("#pages").append(toAppend);
        }
      }
    });
  }
})();