import React, { useEffect, useState, useCallback } from "react";
import { Card, Col, Row, message, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDataFailure,
  fetchDataRequest,
  fetchDataSuccess,
  saveFilter,
} from "../../slices/newsReducer";
import FilterComponent from "../Header";
import debounce from "lodash.debounce"; // Add lodash.debounce package
import Meta from "antd/es/card/Meta";

const API_KEY = "157fb9d58adc4b34bbb05eb4da5c76ef";
const BASE_URL = "https://newsapi.org/v2/everything";

const NewsFeed = () => {
  const { data, filters, loading } = useSelector((state) => state.news);
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
        isChecked &&
        data.length > 0 && (
          <div>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                background: "white",
                zIndex: 1000,
                padding: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <FilterComponent />
            </div>
            <div style={{ marginTop: "20px" }}>
              <Row gutter={16}>
                {data
                  .filter((article) => article.title && article.description)
                  .map((article, index) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={8}
                      lg={6}
                      key={article.url || index}
                      style={{ marginBottom: "16px", padding: "0 8px" }}
                    >
                      <Card
                        title={article.title}
                        hoverable
                        cover={
                          <img
                            alt={article.title}
                            src={article.urlToImage}
                            style={{
                              width: "100%",
                              height: "auto",
                              maxHeight: "150px",
                              objectFit: "cover",
                            }}
                          />
                        }
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }} // Set card to fill its container
                      >
                        <Meta
                          description={article.description}
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        />
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ marginTop: "8px", textAlign: "center" }}
                        >
                          Read more
                        </a>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default NewsFeed;
