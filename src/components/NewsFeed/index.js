import React, { useEffect, useState, useCallback } from "react";
import {  message, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDataFailure,
  fetchDataRequest,
  fetchDataSuccess,
  saveFilter,
} from "../../slices/newsReducer";
import debounce from "lodash.debounce"; 
import ArticleList from "../ArticleList";

const API_KEY = "157fb9d58adc4b34bbb05eb4da5c76ef";
const BASE_URL = "https://newsapi.org/v2/everything";

const NewsFeed = () => {
  const { filters, loading, data } = useSelector((state) => state.news);
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);

  // Load user preferences from localStorage
  useEffect(() => {
    const loadPreferences = () => {
      const preferredData = localStorage.getItem("preferences");
      if (preferredData) {
        try {
          const preferences = JSON.parse(preferredData);
          dispatch(saveFilter(preferences));
          setIsChecked(true);
        } catch (error) {
          console.error("Failed to parse preferences from localStorage", error);
        }
      }
    };
    loadPreferences();
  }, []);
  // Fetch articles with debounce
  const fetchArticles = useCallback(
    debounce(async () => {
      dispatch(fetchDataRequest());
      const params = new URLSearchParams({
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
        apiKey: API_KEY,
      }).toString();

      try {
        const response = await fetch(`${BASE_URL}?${params}`);
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        dispatch(fetchDataSuccess(result.articles));
        if (!result.articles.length > 0) {
          localStorage.setItem("preferences", {});
        }
      } catch (error) {
        dispatch(fetchDataFailure(error.message));
        message.error("Error fetching the news articles");
      }
    }, 500),
    [filters]
  );

  useEffect(() => {
    if (isChecked && !loading) {
      fetchArticles();
    }
  }, [filters, isChecked]);

  return (
    <div>
      {loading ? (
        <Spin
          tip="Loading..."
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        />
      ) : (
        isChecked && data && <ArticleList />
      )}
    </div>
  );
};

export default NewsFeed;
