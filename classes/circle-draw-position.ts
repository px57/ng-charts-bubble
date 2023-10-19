

import { 
    CircleDrawType, 
    GraphContainerType,
    ContainerCoordinates,
    CoordXY,
    SizeContainer,  
} from "../types/chart-bubble.types";

/**
 * @description: 
 */
export class CirclePosition {

    /**
     * @description:
     */
    public objectElement: HTMLElement;

    /**
     * @description:
     */
    public circleDrawType: CircleDrawType;

    /**
     * @description:
     */
    public graphContainer: GraphContainerType;

    constructor(
        objectElement: HTMLElement,
        circleDrawType: CircleDrawType,
        graphContainer: GraphContainerType,
    ) {
        this.objectElement = objectElement;
        this.circleDrawType = circleDrawType;
        this.graphContainer = graphContainer;
    }

    /**
     * @description:  
     */
    public get_one_percent(): CoordXY {
        return {
            x: (this.graphContainer.end_x - this.graphContainer.begin_x) / 100,
            y: (this.graphContainer.end_y - this.graphContainer.begin_y) / 100,
        };
    }

    /**
     * @description:
     */
    public get_rayon(): number {
        return 10;
    }

    /**
     * @description:
     */
    public get_center_of_circle(): CoordXY {
        let onePercent = this.get_one_percent();

        let x = (this.circleDrawType.percent_x * onePercent.x) + this.graphContainer.begin_x;
        let y = (this.circleDrawType.percent_y * onePercent.y) + this.graphContainer.begin_y;

        return {
            x: x,
            y: y,
        };
    }
    
    /**
     * @description:
     */
    public get_position_of_circle(): CoordXY {
        let centerOfCircle = this.get_center_of_circle();
        let rayon = this.get_rayon();
        return {
            x: centerOfCircle.x - rayon,
            y: centerOfCircle.y - rayon,
        };
    }

    /**
     * @description: Get the coordinates of the circle. 
     * @param.bottom_left -> 
     * @param.bottom_right ->
     * @param.top_left ->
     * @param.top_right ->
     * @returns {
     *   bottom_left: number,  
     *   bottom_right: number,
     *   top_left: number,
     *   top_right: number,
     * }
     */
    public get_coordinates(): ContainerCoordinates {
        let positionOfCircle = this.get_position_of_circle();
        let rayon = this.get_rayon();

        return {
            bottom_left: positionOfCircle.x,
            bottom_right: positionOfCircle.x + (rayon * 2),
            top_left: positionOfCircle.y,
            top_right: positionOfCircle.y + (rayon * 2),
        };
    }

    /**
     * @description:
     */
    public whereasspace__toboxcontainer(): CoordXY {
        const centerOfCircle = this.get_center_of_circle();
        if (this.hasspaceright__toboxcontainer()) {
            return {
                x: centerOfCircle.x + this.get_rayon(),
                y: centerOfCircle.y,
            };
        } else if (this.hasspacebottom__toboxcontainer()) {
            return {
                x: centerOfCircle.x,
                y: centerOfCircle.y + this.get_rayon(),
            };
        } else if (this.hasspacetop__toboxcontainer()) {
            return {
                x: centerOfCircle.x,
                y: centerOfCircle.y - this.get_rayon(),
            };
        } else if (this.hasspaceleft__toboxcontainer()) {
            return {
                x: centerOfCircle.x - this.get_rayon(),
                y: centerOfCircle.y,
            };
        }
        throw new Error('Error: No space available');
    }
    
    /**
     * @description:
     */
    private hasspaceright__toboxcontainer(): boolean {
        const centerOfCircle = this.get_center_of_circle();
        return centerOfCircle.x + this.get_rayon() < this.graphContainer.end_x;
    }

    /**
     * @description:
     */
    private hasspaceleft__toboxcontainer(): boolean {
        const centerOfCircle = this.get_center_of_circle();
        return centerOfCircle.x - this.get_rayon() > this.graphContainer.begin_x;
    }
    
    /**
     * @description:
     */
    private hasspacebottom__toboxcontainer(): boolean {
        const centerOfCircle = this.get_center_of_circle();
        return centerOfCircle.y + this.get_rayon() < this.graphContainer.end_y;
    }

    /**
     * @description:
     */
    private hasspacetop__toboxcontainer(): boolean {
        const centerOfCircle = this.get_center_of_circle();
        return centerOfCircle.y - this.get_rayon() > this.graphContainer.begin_y;
    }
}


