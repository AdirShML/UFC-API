const axios = require('axios');
const cheerio = require('cheerio');

const UrlList = {
    choose_target: function(events) {
        if (events === 'event fetch') {
            return "https://www.ufc.com/events";
        } else {
            return `https://www.ufc.com/search?query=${encodeURIComponent(events)}&referrerPageUrl=`;
        }
    }
};

// This function fetches the upcoming events card
async function events_fetching() {
    try {
        const index = UrlList.choose_target('event fetch');
        if (!index) {
            throw new Error('No valid URL found for the target type.');
        }

        const { data } = await axios.get(index);
        const $ = cheerio.load(data);
        const events = [];

        $(".c-card-event--result__info").each((i, element) => {
            const card = $(element).find('h3').text().trim();
            const date = $(element).find(".c-card-event--result__date").text().trim();

            events.push({
                card: card,
                date: date,
            });
        });

        console.log(events); // Output the scraped event titles and dates
        return events;
    } catch (error) {
        console.error('Error fetching events:', error.message);
        throw error; // Re-throw the error so it can be handled in the calling function
    }
}

module.exports = {
    UrlList,
    events_fetching
};