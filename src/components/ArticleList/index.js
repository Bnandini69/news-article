import React from "react";
import FilterComponent from "../Header";
import { useSelector } from "react-redux";
import { Card, Col, Row } from "antd";
import Meta from "antd/es/card/Meta";
import NoArticles from "../NoArticle";

const ArticleList = () => {
  const { data, } = useSelector((state) => state.news);
  const dummyImageUrl = 'https://via.placeholder.com/150';
  const handleError = (e) => {
    e.target.src = dummyImageUrl;
  };
  return (
    <>
      {data?.length > 0 ? (
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
                .filter((article) => article.title && article.description )
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
                          onError={handleError}
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
      ) : (
       <NoArticles />
      )}
    </>
  );
};

export default ArticleList;
