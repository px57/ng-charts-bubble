

/**
 * @description: 
 * @param.r: 
 * @param.transform_x:
 * @param.transform_y:
 * @param.number:
 */
export interface CircleDrawType {
    r: number;
    percent_x: number;
    percent_y: number;
    number: number;
    data: any;
};

/**
 * @description:
 * @param.begin_x: 
 * @param.begin_y:
 * 
 * @param.end_x:
 * @param.end_y:
 */
export interface GraphContainerType {
    begin_x: number;
    begin_y: number;

    end_x: number;
    end_y: number;
};

/**
 * @description: 
 */
export interface ContainerCoordinates {
    bottom_left: number, 
    bottom_right: number, 
    top_left: number, 
    top_right: number,
};

/**
 * @description:
 */
export interface CoordXY {
    x: number;
    y: number;
};

/**
 * @description:
 */
export interface SizeContainer {
    width: number;
    height: number;
};