import styled from "styled-components";

const MapStyling = styled.div`
  path {
    ${(props) => props.colors.provinces}
    &:hover {
      opacity: 0.5;
      cursor: pointer;
    }
  }
  svg {
    stroke: #fff;
    fill: ${(props) => props.colors.default};
    margin: 0% 5%;
  }
`;

export default MapStyling;
