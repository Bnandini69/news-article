import React from "react";
import { Empty, Button, Typography } from "antd";
import "./NoArticle.css";

const { Title, Paragraph } = Typography;

const NoArticles = () => {
  return (
    <div className="container">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Typography>
            <Title className="title" level={3}>
              No Articles Found
            </Title>
            <Paragraph className="paragraph">
              It looks like we couldn’t find any articles matching your
              criteria. Try adjusting your filters or check back later.
            </Paragraph>
            <Button
              className="refresh-button"
              type="primary"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </Typography>
        }
      />
    </div>
  );
};

export default NoArticles;
