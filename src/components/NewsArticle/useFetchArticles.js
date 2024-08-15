import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataFailure, fetchDataRequest, fetchDataSuccess } from "../../slices/newsReducer";

const API_KEYS = {
  NEWSAPI: "157fb9d58adc4b34bbb05eb4da5c76ef",
  NYT: "9AE5kILCuMPAkZoMzECsyTgHeC2ZbUKG",
  GUARDIAN: "197593d7-e008-45ea-a021-bea0ef36a242",
};

const BASE_URLS = {
  NEWSAPI: "https://newsapi.org/v2/everything",
  NYT: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
  GUARDIAN: "https://content.guardianapis.com/search",
};

const DUMMY_IMAGE_URL = "https://via.placeholder.com/150";

const useFetchArticles = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.news);

  const prepareParams = () => {
    // Prepare parameters for NewsAPI
    const newsApiParams = new URLSearchParams({
      q: filters?.keyword || "tesla",
      ...(filters.dateRange?.length === 2 && {
        from: filters.dateRange[0],
        to: filters.dateRange[1],
      }),
      ...(filters.categories.length > 0 && {
        categories: filters.categories.join(","),
      }),
      ...(filters.sources.length > 0 && {
        sources: filters.sources.join(","),
      }),
      apiKey: API_KEYS.NEWSAPI,
    }).toString();

    // Prepare parameters for NYT API
    const nytParams = new URLSearchParams({
      q: filters?.keyword || "tesla",
      ...(filters.dateRange?.length === 2 && {
        begin_date: filters.dateRange[0].replace(/-/g, ""),
        end_date: filters.dateRange[1].replace(/-/g, ""),
      }),
      ["api-key"]: API_KEYS.NYT,
    }).toString();

    // Prepare parameters for Guardian API
    const guardianParams = new URLSearchParams({
      q: filters?.keyword || "tesla",
      ...(filters.dateRange?.length === 2 && {
        ["from-date"]: filters.dateRange[0],
        ["to-date"]: filters.dateRange[1],
      }),
      ["api-key"]: API_KEYS.GUARDIAN,
      fields: "trailText",
    }).toString();

    return { nytParams, guardianParams, newsApiParams };
  };

  const getCombinedResults = (results) => {
    // Normalize and combine articles
    const combinedResults = [];

    // NewsAPI
    const newsApiResult = results?.[0]?.data;
    if (newsApiResult) {
      const normalizedNewsApiArticles = newsApiResult?.articles?.map(
        (article) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
        })
      );
      combinedResults.push(...normalizedNewsApiArticles);
    }

    // NYT
    const nytResult = results[1].data;
    if (nytResult) {
      const normalizedNytArticles = nytResult?.response?.docs?.map((article) => ({
        title: article.headline.main,
        description: article.snippet,
        url: article.web_url,
        urlToImage: article.multimedia?.[0]?.url
          ? `https://www.nytimes.com/${article.multimedia[0].url}`
          : DUMMY_IMAGE_URL,
      }));
      combinedResults.push(...normalizedNytArticles);
    }

    // Guardian
    const guardianResult = results[2].data;
    if (guardianResult) {
      const normalizedGuardianArticles = guardianResult?.response?.results?.map(
        (article) => ({
          title: article.webTitle,
          description: article.sectionName,
          url: article.webUrl,
          urlToImage: `${article.webUrl}#img-1`, // Assuming Guardian doesn't provide image URL directly
        })
      );
      combinedResults.push(...normalizedGuardianArticles);
    }

    return combinedResults;
  };

  const fetchArticles = useCallback(async () => {
    dispatch(fetchDataRequest());
    const { nytParams, guardianParams, newsApiParams } = prepareParams();

    try {
      // Fetch data from all APIs
      const responses = await Promise.allSettled([
        fetch(`${BASE_URLS.NEWSAPI}?${newsApiParams}`),
        fetch(`${BASE_URLS.NYT}?${nytParams}`),
        fetch(`${BASE_URLS.GUARDIAN}?${guardianParams}`),
      ]);

      const results = await Promise.all(
        responses.map(async (response) => {
          if (response.status === "fulfilled") {
            const data = await response.value.json();
            if (data.status !== "error") {
              return { data, error: null };
            } else {
              return { data: null, error: null };
            }
          }
        })
      );
      const combinedResults = getCombinedResults(results);
      dispatch(fetchDataSuccess(combinedResults));

      if (combinedResults.length === 0) {
        localStorage.clear();
      }
    } catch (error) {
      console.error("An error occurred while fetching articles:", error);
      dispatch(fetchDataFailure(error.message));
    }
  }, [filters]);

  return { fetchArticles };
};

export default useFetchArticles;
