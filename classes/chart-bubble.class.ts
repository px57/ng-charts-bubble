

import { StaticInjector } from "@angular/core/src/di/injector";
import { 
    CircleDrawType, 
    GraphContainerType,
} from "../types/chart-bubble.types";
import { CirclePosition } from "./circle-draw-position";

// ####################################### [PositionObject] #######################################

/**
 * @description: 
 */
export class CellContentObjectPosition {

    /**
     * @description: 
     */
    public graphContainer: GraphContainerType;

    /**
     * @description:
     * @param index 
     */
    public index: number;

    /**
     * @description:
     */
    public cellContent: CellContentObject;

    /**
     * @description:
     */
    public circleBound: any;

    /**
     * @description:
     */
    public cellContentBound: any;

    /**
     * @description: 
     */
    constructor(
        cellContent: CellContentObject,
    ) {
        this.cellContent = cellContent;
        this.graphContainer = cellContent.centerOfCircle.graphContainer;
        this.index = cellContent.index;
        // -> Get the position of the the circle in the graphContainer.

        this.circleBound = this.cellContent.centerOfCircle.objectElement.getBoundingClientRect();
        this.cellContentBound = this.cellContent.objectToSvg.getBoundingClientRect();
    }


    /**
     * @description: Has the cellContent enough space above the circle to be placed there? 
     */
    public space_above(): boolean {
        
        return true;
    }

    /**
     * @description: 
     */
    public space_below(): boolean {
        const space = this.cellContentBound.y - this.circleBound.y;
        return true;
    }

    /**
     * @description:
     */
    public space_left(): boolean {
        const space = this.cellContentBound.x - this.circleBound.x;
        return true;
    }

    /**
     * @description:
     */
    public space_right(): boolean {
        const space = this.circleBound.x - this.cellContentBound.x;
        return true;
    }

}


// ####################################### [CellContentObject] #######################################

/**
 * @description: 
 */
export function adjustOverlappingTexts() {
    const elements = document.querySelectorAll('.centered_number_text');
    const rects = Array.from(elements).map(el => el.getBoundingClientRect());

    rects.forEach((rect1, i) => {
        rects.forEach((rect2, j) => {
            if (i !== j && isOverlapping(rect1, rect2)) {
                // Déplacer l'un des éléments
                const elToMove = elements[j];
                const currentY = parseFloat(elToMove.getAttribute('y'));
                elToMove.setAttribute('y', (currentY + 10).toString()); // Déplacez de 10, par exemple
            }
        });
    });
}

/**
 * @description: 
 */
export function isOverlapping(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}




/**
 * @description: 
 */
export class CellContentObject {
    /**
     * @description: 
     */
    public centerOfCircle: CirclePosition;

    /**
     * @description: 
     */
    public circleDrawType: CircleDrawType;

    /**
     * @description: 
     */
    public index: number;

    /**
     * @description:
     */
    public objectElement: HTMLElement;

    /**
     * @description: 
     */
    public opened: boolean = false;

    /**
     * @description:
     */
    public objectToSvg: HTMLElement;

    /**
     * @description:
     */
    public position: CellContentObjectPosition;

    /**
     * @description:
     */
    public circle: CircleObject;

    constructor(
        objectElement: HTMLElement,
        centerOfCircle: CirclePosition,
        circle: CircleObject,
        index: number,
    ) {
        this.circle = circle;
        this.centerOfCircle = centerOfCircle;
        this.index = index;
        this.objectElement = objectElement;
        this.objectToSvg = this.create_cell_content();
        this.cellcontent_update_position();
        this.circleDrawType = centerOfCircle.circleDrawType;

        this.set_title();
        this.set_rigth_container_text();
        this.set_left_container_text();
        this.set_background_color();
        
        this.position = new CellContentObjectPosition(this);
    }

    /**
     * @description: 
     */
    private set_title(): void {
        this.get_element_in_cellContent('use_case_text').innerHTML = this.circleDrawType.data.title;
    }

    /**
     * @description: 
     */
    public show_cell_content(): void {
        this.objectToSvg.setAttribute('visibility', 'visible');
    }

    /**
     * @description: 
     */
    public hide_cell_content(): void {
        this.objectToSvg.setAttribute('visibility', 'hidden');
    }

    /**
     * @description: 
     */
    private set_rigth_container_text(): void {
        const right_container_text = this.get_grey_rigth_container();
        const text = right_container_text.querySelector('text');
        text.innerHTML = this.circleDrawType.data.right_container;
    }

    /**
     * @description: 
     */
    private set_background_color(): void {
        const general_container = this.get_general_container();
        
        general_container.setAttribute('fill', this.circleDrawType.data.background_cell_color.rgba);
    }

    /**
     * @description:
     */
    private set_left_container_text(): void {
        const left_container_text = this.get_grey_left_container();
        const text = left_container_text.querySelector('text');
        text.innerHTML = this.circleDrawType.data.left_container;
    }


    /**
     * @description:
     */
    private create_cell_content(): HTMLElement {
        const svgDocument = (this.objectElement as any).contentDocument;
        const cellContentGroup = svgDocument.getElementById(`cellContent`);

        if (this.index === 0) {
            return cellContentGroup;
        }

        const clonedGroup = cellContentGroup.cloneNode(true);

        const newId = `cellContent${this.index}`;
        clonedGroup.setAttribute('id', newId);
        svgDocument.getElementById('graphContainer').appendChild(clonedGroup);
        return clonedGroup;
    }

    /**
     * @description: 
     */
    private get_cellContent_id(): string {
        if (this.index === 0) {
            return `cellContent`;
        }
        return `cellContent${this.index}`;
    }

    /**
     * @description: 
     */
    private get_element_in_cellContent(elementId: string): HTMLElement {
        return (this.objectElement as any)
            .contentDocument
            .querySelector(`#${this.get_cellContent_id()} #${elementId}`);
    }

    /**
     * @description:
     */
    private cellcontent_update_position(): void {
        const position = this.circle.get_circle_position();
        position.x = position.x - 30;
        position.y = position.y + 10;
        this.objectToSvg.setAttribute('transform', `translate(${position.x}, ${position.y})`);
    }

    /**
     * @description:
     */
    private get_grey_rigth_rect(): HTMLElement {
        const grey_rigth_rect = this.get_element_in_cellContent('grey_rigth_rect');
        // const grey_rigth_rect = (this.objectElement as any).contentDocument.querySelector(`#${this.get_cellContent_id()} #grey_rigth_rect`);
        return grey_rigth_rect;
    }

    /**
     * @description:
     */
    private get_grey_left_rect(): HTMLElement {
        const grey_left_rect_text = this.get_element_in_cellContent('grey_left_rect');
        // const grey_left_rect_text = (this.objectElement as any).contentDocument.getElementById('grey_left_rect');
        return grey_left_rect_text;
    }

    /**
     * @description:
     */
    private get_all_dom_elements(): any {
        return {
            container: this.get_general_container(),
            left_grey_container: this.get_grey_left_container(),
            right_grey_container: this.get_grey_rigth_container(),
        };
    }

    /**
     * @description: 
     */
    private get_general_container(): HTMLElement {
        return this.get_element_in_cellContent('cellContentVioletContainer');
    }

    /**
     * @description: 
     */
    private get_grey_left_container(): HTMLElement {
        return this.get_element_in_cellContent('grey_left_container');
        // return (this.objectElement as any).contentDocument.getElementById('grey_left_container');
    }

    /**
     * @description: 
     */
    private get_grey_rigth_container(): HTMLElement {
        let right_container = this.get_element_in_cellContent('grey_rigth_container');
        if (right_container === null) {
            if (this.create_grey_right_container()) {
                return this.get_grey_rigth_container();
            }
            return null;
        }
        return right_container;
    }

    /**
     * @description: Create the grey right container, with left grey container.
     */
    private create_grey_right_container(): boolean {
        const svgDocument = (this.objectElement as any).contentDocument;
        const cellContentGroup = svgDocument.getElementById(this.get_cellContent_id());
        const grey_container = this.get_grey_left_container();
        const clonedGroup = grey_container.cloneNode(true);
        const newId = 'grey_rigth_container';

        (clonedGroup as any).setAttribute('id', newId);
        (clonedGroup as any).setAttribute('transform', ` translate(29, 0)`);
        cellContentGroup.appendChild(clonedGroup);
        return true;       
    }
}

// ####################################### [CircleObject] #######################################

/**
 * @description: 
 */
export class CircleObject {
    /**
     * @description:
     * @param id 
     * @param index 
     */
    public id: string;

    /**
     * @description:
     */
    public raw_id: string;

    /**
     * @description:
     * @param index 
     */
    public index: number;

    /**
     * @description:
     * @param objectElement 
     */
    public objectElement: HTMLElement;

    /**
     * @description:
     * @param objectToSvg
     */
    public objectToSvg: HTMLElement;

    /**
     * @description: 
     */
    public graphContainer: GraphContainerType;

    /**
     * @description: 
     */
    public centerOfCircle: CirclePosition;

    /**
     * @description: 
     */
    public contentCell: CellContentObject;

    /**
     * @description:
     */
    public circleDrawType: CircleDrawType;

    /**
     * @description: 
     * @param raw_id 
     * @param index 
     * @param objectElement 
     * @param circleDrawType 
     */
    constructor(
        raw_id: string,
        index: number,
        objectElement: HTMLElement,
        circleDrawType: CircleDrawType,
        graphContainer: GraphContainerType,
    ) {
        this.raw_id = raw_id;
        this.id = this.get_id(raw_id, index);
        this.index = index;
        this.objectElement = objectElement;
        this.objectToSvg = this.create_circle_to_svg(
            index, 
            this.id,
            this.raw_id, 
            objectElement
        );
        this.circleDrawType = circleDrawType;
        this.graphContainer = graphContainer;
        this.centerOfCircle = new CirclePosition(
            this.objectToSvg, 
            circleDrawType,
            graphContainer,
        );

        this.update_position(
            this.objectToSvg, 
            circleDrawType,
            graphContainer, 
        );

        this.update_rayon(this.objectToSvg, circleDrawType);
        this.contentCell = new CellContentObject(
            objectElement,
            this.centerOfCircle,
            this,
            index,
        );
        this.set_number();
        this.set_title();
        this.event_mouseover();
        this.event_mouseout();
        this.set_color_to_circle();
    }

    /**
     * @description: set the number of the circle. 
     */
    private set_number(): void {
        const number_text = this.objectToSvg.getElementsByClassName('centered_number_text');
        const number = this.circleDrawType.number.toString();
        number_text[0].innerHTML = number;
    }

    /**
     * @description: is default title properties.
     */
    private set_title(): void {
        const name_of_circle = this.objectToSvg.getElementsByClassName('name_of_circle')[0];
        name_of_circle.innerHTML = this.circleDrawType.data.title;
        name_of_circle.setAttribute('font-family', 'Arial');
        name_of_circle.setAttribute('opacity', '0.5');
        name_of_circle.setAttribute('font-weight', 'normal');
    }

    /**
     * @description: Change the title properties when the mouse is over the circle.
     */
    private set_mouseover_title(): void {
        const name_of_circle = this.objectToSvg.getElementsByClassName('name_of_circle')[0];
        name_of_circle.setAttribute('opacity', '1');
        name_of_circle.setAttribute('font-weight', 'bold');
    }


    /**
     * @description: Change the color of the circle.
     */
    private set_color_to_circle(): void {
        const background_cell_color = this.circleDrawType.data.background_cell_color;
        this.getexternalCircle().setAttribute('fill', background_cell_color.mixtransparent(0.3).rgba);
        this.getexternalCircle().setAttribute('stroke', background_cell_color.rgba);
    }


    /**
     * @description: Bind the mouseover event to the circle.
     */
    private event_mouseover(): void {
        this.objectToSvg.addEventListener('mouseover', () => {
            this.contentCell.show_cell_content();
            this.getexternalCircle().setAttribute('stroke-width', '1');
            this.set_mouseover_title();
        });
    }

    /**
     * @description: Bind the mouseout event to the circle.
     */
    private event_mouseout(): void {
        this.objectToSvg.addEventListener('mouseout', () => {
            this.contentCell.hide_cell_content();
            this.getexternalCircle().setAttribute('stroke-width', '0.3');
            this.set_title();
        });
    }

    /**
     * @description: Get the id of the circle.
     */
    private get_id(id: string, index: number): string {
        if (index === 0) {
            return id;
        }
        return `${id}${index}`;
    }

    /**
     * @description: Generate the circle in the svg.
     */
    private create_circle_to_svg(
        index: number, 
        id: string, 
        raw_id: string,
        objectElement: HTMLElement): HTMLElement {
        const svgDocument = (objectElement as any).contentDocument;
        const cellContentGroup = svgDocument.getElementById(raw_id);
        if (index === 0) {
            return cellContentGroup;
        }
        const clonedGroup = cellContentGroup.cloneNode(true);
        const newId = id;
        clonedGroup.setAttribute('id', newId);
        svgDocument.getElementById('graphContainer').appendChild(clonedGroup);
        return clonedGroup;
    }

    /**
     * @description:
     * @param objectToSvg
     * @param circleDrawType
     * @param graphContainer 
     */
    private update_position(
        objectToSvg: HTMLElement, 
        circleDrawType: CircleDrawType,
        graphContainer: GraphContainerType,
    ): void {
        const position = this.get_circle_position();
        objectToSvg.setAttribute('transform', `translate(${position.x}, ${position.y})`);
        // objectToSvg.setAttribute('y', position.x.toString());
        // objectToSvg.setAttribute('x', position.y.toString());
    }

    /**
     * @description: 
     */
    public get_circle_position(): {x: number, y: number} {
        return {
            x: this.circleDrawType.percent_x,
            y: this.circleDrawType.percent_y,
        };
    }

    /**
     * @description:
     */
    private update_rayon(
        objectToSvg: HTMLElement,
        circleDrawType: CircleDrawType): void {
        this.getexternalCircle().setAttribute('r', `${circleDrawType.r}`);
    }

    /**
     * @description:
     */
    private getexternalCircle(): HTMLElement {
        return this.objectToSvg.querySelector('#circle-external');
    }

}