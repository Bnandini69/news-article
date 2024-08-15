import React, { useCallback, useState } from "react";
import {
  DatePicker,
  Input,
  Button,
  Row,
  Col,
  Space,
  Form,
  Popover,
  Checkbox,
  Collapse,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { categoriesList, sources } from "../Newsenum";
import { saveFilter } from "../../slices/newsReducer";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Search } = Input;

const FilterComponent = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.news);

  const [appliedFilter, setAppliedFilter] = useState({
    keyword: filters.keyword || "",
    dateRange:filters.dateRange || [],
    categories: filters.categories || [],
    sources: filters.sources || [],
    authors: filters.authors || [],
  });
  const [visible, setVisible] = useState(false);

  const iconColor =
    appliedFilter.categories.length > 0 || appliedFilter.sources.length > 0
      ? "#1890ff"
      : "inherit";

  const handleFilter = useCallback(() => {
    dispatch(saveFilter(appliedFilter));
    localStorage.setItem("preferences", JSON.stringify(appliedFilter));
    setVisible(false);
  }, [appliedFilter, dispatch]);

  const handleSearch = (val) => {
    setAppliedFilter((prev) => ({ ...prev, keyword: val }));
    dispatch(saveFilter({ ...appliedFilter, keyword: val }));
  };

  const handleChange = (key, value) => {
    setAppliedFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (dates) => {
    const formattedDates = dates
      ? dates.map((date) => date.format("YYYY-MM-DD"))
      : [];
    setAppliedFilter((prev) => ({ ...prev, dateRange: formattedDates }));
    dispatch(saveFilter({ ...appliedFilter, dateRange: formattedDates }));
  };

  const handleReset = () => {
    setAppliedFilter({
      keyword: filters.keyword,
      dateRange: [],
      categories: [],
      sources: [],
      authors: [],
    });
    handleFilter();
  };
  const getMomentDateRange = () => {
    if (filters.dateRange?.length === 2) {
      return [
        moment(filters.dateRange[0], "YYYY-MM-DD"),
        moment(filters.dateRange[1], "YYYY-MM-DD"),
      ];
    }
    return [];
  };
  console.log(getMomentDateRange())
  const popoverContent = (
    <Form layout="vertical" style={{ width: "300px" }}>
      <Collapse accordion>
        <Panel header="Category" key="1">
          <Checkbox.Group
            options={categoriesList}
            value={appliedFilter.categories}
            onChange={(values) => handleChange("categories", values)}
          />
        </Panel>
        <Panel
          header="Sources"
          key="2"
          style={{
            color: appliedFilter.sources.length > 0 ? "#1890ff" : "inherit",
          }}
        >
          <Checkbox.Group
            options={sources?.map((source) => ({
              label: source.name,
              value: source.id,
            }))}
            value={appliedFilter.sources}
            onChange={(values) => handleChange("sources", values)}
          />
        </Panel>
      </Collapse>
      <Form.Item style={{ padding: "10px" }}>
        <Space>
          <Button type="primary" onClick={handleFilter}>
            Apply
          </Button>
          <Button onClick={handleReset}>Reset</Button>
        </Space>
      </Form.Item>
    </Form>
  );
  return (
    <div>
      <Row gutter={16} align="middle" justify="space-between">
        <Col>
          <Row gutter={16} align="middle">
            <Col>
              <Search
                placeholder="input search text"
                onSearch={handleSearch}
                enterButton="Search"
                value={appliedFilter.keyword}
                onChange={(e) => handleChange("keyword", e.target.value)}
              />
            </Col>
            <Col>
              <Popover
                onOpenChange={setVisible}
                open={visible}
                content={popoverContent}
                title="Filters"
                placement="bottomRight"
              >
                <Button
                  icon={<FilterOutlined style={{ color: iconColor }} />}
                  onClick={() => setVisible(true)}
                />
              </Popover>
            </Col>
          </Row>
        </Col>
        <Col>
          <RangePicker
            format="YYYY-MM-DD"
            onChange={handleDateChange}
            value={getMomentDateRange()}
          />
        </Col>
      </Row>
    </div>
  );
};

export default FilterComponent;
