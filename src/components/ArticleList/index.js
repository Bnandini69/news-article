import React from "react";
import FilterComponent from "../Header";
import { useSelector } from "react-redux";
import { Card, Col, Row } from "antd";
import Meta from "antd/es/card/Meta";
import NoArticles from "../NoArticle";
import "./ArticleList.css";
import { UserOutlined } from "@ant-design/icons";

const ArticleList = () => {
  const { data } = useSelector((state) => state.news);
  const dummyImageUrl = "https://via.placeholder.com/150";

  const handleError = (e) => {
    e.target.src = dummyImageUrl;
  };

  return (
    <>
      {data?.length > 0 ? (
        <div>
          <div className="fixed-header">
            <FilterComponent />
            <div className="profile-icon">
              <UserOutlined />
            </div>
          </div>
          <div className="content">
            <Row gutter={16}>
              {data
                .filter(
                  (article) =>
                    !Object.keys(article).some(
                      (key) => article[key] === "[Removed]" 
                    )&& article.description
                )
                .map((article, index) => (
                  <Col
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    key={article.url || index}
                    className="article-col"
                  >
                    <Card
                      title={article.title}
                      hoverable
                      cover={
                        <img
                          alt={article.title}
                          src={article.urlToImage || dummyImageUrl}
                          onError={handleError}
                          className="article-image"
                        />
                      }
                      className="article-card"
                    >
                      <Meta
                        description={article.description}
                        className="article-meta"
                      />
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="read-more-link"
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
