

import { StaticInjector } from "@angular/core/src/di/injector";
import { 
    CircleDrawType, 
    GraphContainerType,
    SizeContainer, 
} from "../types/chart-bubble.types";
import { CirclePosition } from "./circle-draw-position";
import { runInThisContext } from "vm";

/**
 * @description: 
 */
export class PositionObject {

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
    constructor(
        index: number,
    ) {

    }
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

    constructor(
        objectElement: HTMLElement,
        centerOfCircle: CirclePosition,
        index: number,
    ) {
        this.centerOfCircle = centerOfCircle;
        this.index = index;
        this.objectElement = objectElement;
        this.objectToSvg = this.create_cell_content();
        this.update_position();
        this.circleDrawType = centerOfCircle.circleDrawType;
        this.set_title();
        

        setTimeout(() => {
            this.set_event_eye_closed();
            this.set_event_eye_opened();
            this.redraw();
        }, 100);
    }

    /**
     * @description: 
     */
    private set_title(): void {
        console.log(this.centerOfCircle);
        console.log(this.circleDrawType);
        this.get_element_in_cellContent('use_case_text').innerHTML = this.circleDrawType.data.title;
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
    private update_position(): void {
        const position = this.centerOfCircle.whereasspace__toboxcontainer();

        this.objectToSvg.setAttribute('transform', `translate(${position.x}, ${position.y})`);
    }

    /**
     * @description:
     */
    private redraw(): void {
        this.redraw_opened();
        this.redraw_closed();
    }

    /**
     * @description:
     */
    private redraw_opened(): void {
        if (!this.opened) { return }
        this.get_general_container().setAttribute('height', '28px');
        this.get_closeeye().setAttribute('visibility', 'visible');
        this.get_openeye().setAttribute('visibility', 'hidden');
        this.get_grey_left_container().setAttribute('visibility', 'visible');
        this.get_grey_rigth_container().setAttribute('visibility', 'visible');
    }

    /**
     * @description:
     */
    private redraw_closed(): void {
        if (this.opened) { return }
        this.get_general_container().setAttribute('height', '14');
        this.get_closeeye().setAttribute('visibility', 'hidden');
        this.get_openeye().setAttribute('visibility', 'visible');
        this.get_grey_left_container().setAttribute('visibility', 'hidden');
        this.get_grey_rigth_container().setAttribute('visibility', 'hidden');
    }

    /**
     * @description:
     */
    private get_openeye(): HTMLElement {
        const eye_opened = this.get_element_in_cellContent('eye_opened');
        return eye_opened;
    }

    /**
     * @description:
     */
    private set_event_eye_opened(): void {
        const eye_opened = this.get_openeye();
        eye_opened.addEventListener('click', () => {
            console.log('set_event_eye_opened');
            this.opened = true;
            this.redraw();
        });
    }

    /** 
     * @description:
     */
    private get_closeeye(): HTMLElement {
        const closeeye = this.get_element_in_cellContent('eye_closed');
        // const closeeye = (this.objectElement as any).contentDocument.querySelector(`#${this.get_cellContent_id()} #eye_closed`);
        return closeeye;
    }

    /**
     * @description:
     */
    private set_event_eye_closed(): void {
        const eye_closed = this.get_closeeye();
        eye_closed.addEventListener('click', () => {
            console.log('set_event_eye_closed');
            this.opened = false;
            this.redraw();
        });
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
    private show_or_hide_grey_rigth_rect(): void {
        const grey_rigth_rect = this.get_grey_rigth_rect();
        if (this.opened) {
            grey_rigth_rect.setAttribute('visibility', 'visible');
            return;
        }
        grey_rigth_rect.setAttribute('visibility', 'hidden');
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
        // return (this.objectElement as any).contentDocument.getElementById('cellContentVioletContainer');
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
        let right_container = (this.objectElement as any).contentDocument.getElementById('grey_rigth_container');
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
        // TODO: clone 
        const svgDocument = (this.objectElement as any).contentDocument;
        const cellContentGroup = this.get_grey_left_container();
        const clonedGroup = cellContentGroup.cloneNode(true);
        const newId = 'grey_rigth_container';
        if (clonedGroup === null) {
            return false;
        }
        clonedGroup.setAttribute('id', newId);
        svgDocument.getElementById('cellContentVioletContainer').appendChild(clonedGroup);
        // right_container = clonedGroup;
        return true;       
    }
}


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
            index,
        );
    }

    /**
     * @description: 
     */
    private get_id(id: string, index: number): string {
        if (index === 0) {
            return id;
        }
        return `${id}${index}`;
    }

    /**
     * @description: 
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
        let position = this.centerOfCircle.get_center_of_circle();
        objectToSvg.setAttribute('transform', `translate(${position.x}, ${position.y})`);
    }

    /**
     * @description:
     */
    private update_rayon(
        objectToSvg: HTMLElement,
        circleDrawType: CircleDrawType): void {
        const externalCircle = objectToSvg.querySelector('#circle-external');
        externalCircle.setAttribute('r', `${circleDrawType.r}`);
    }
}