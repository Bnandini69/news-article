import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { saveFilter } from "../../slices/newsReducer";
import useFetchArticles from "./useFetchArticles";
import ArticleList from "./ArticleList";

const NewsArticle = () => {
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
        } catch (error) {
          console.error("Failed to parse preferences from localStorage", error);
        }
      }
      setIsChecked(true);
    };
    loadPreferences();
  }, []);
  // Fetch articles with the hook
  const { fetchArticles } = useFetchArticles();

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

export default NewsArticle;
