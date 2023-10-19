import { 
  Component, 
  OnInit,
  Input, 
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Renderer2, 
} from '@angular/core';
import { NumberValueAccessor } from '@angular/forms/src/directives';
import { CellContentObject, CircleObject } from '../../classes/chart-bubble.class';
import { CircleDrawType, GraphContainerType } from '../../types/chart-bubble.types'; 
export { CircleDrawType } from '../../types/chart-bubble.types';


@Component({
  selector: 'chart-bubble',
  templateUrl: './chart-bubble.component.html',
  styleUrls: ['./chart-bubble.component.scss']
})
export class ChartBubbleComponent implements OnInit {
  /**
   * @description:
   */
  @Input() public data: any;

  /**
   * @description:
   */
  @Input() public axeY = {
    legend: 'Accessibility',
    max: 5,
  };

  /**
   * @description: 
   */
  @Input() public axeX = {
    legend: 'Attractiveness',
    max: 5,
  };

  /**
   * @description: 
   */
  @Input() public min: number = 0;

  /**
   * @description: 
   */
  @ViewChild('svgContainer') svgContainer: ElementRef;

  /**
   * @description: 
   * translate(-20, -38) -> position minimum en haut a gauche
   * translate(148, 129) -> position maximum en bas a droite
   */
  @Input()
  public circle_list: Array<CircleDrawType> = [
    {
      data: {
        title: 'oeauoeu',
      },
      percent_x: 0,
      percent_y: 20,
      r: 20,
      number: 0
    },
    {
      data: {
        title: 'eoauoeuaoe',
      },
      percent_x: 20,
      percent_y: 70,
      r: 20,
      number: 0
    },
  ];

  /**
   * @description: Il s'agit ici de la zone de dessin du graphique.
   */
  @Input()
  public graphContainer: GraphContainerType = {
    begin_x: 0,
    begin_y: -19,

    end_x: 169,
    end_y: 149,
  };

  /**
   * @description: 
   */
  constructor(
    private renderer: Renderer2
  ) { }

  /**
   * @description:
   */
  public ngOnInit() {
    this.loadSVGContent();
  }

  /**
   * @description:
   */
  public loadSVGContent() {
    const svgUrl = 'assets/svg/chart-bubble_optimized.svg';

    // Chargez le contenu SVG dans le conteneur
    this.renderer.setProperty(this.svgContainer.nativeElement, 'innerHTML', `<object type="image/svg+xml" data="${svgUrl}" ></object>`);

    // Attachez un événement au contenu SVG chargé
    const objectElement = this.svgContainer.nativeElement.querySelector('object');
    objectElement.addEventListener('load', () => {
      this.handleSVGLoaded(objectElement);
    });
  }

  /**
   * @description:
   */
  public handleSVGLoaded(objectElement: HTMLElement) {
    // this.addRedCircleForTest(objectElement);
    // this.contentCellManage(objectElement);
    this.circleGenerate(objectElement);
    this.setMaxValue(objectElement);

  }

  /**
   * @description: 
   */
  private setMaxValue(objectElement: HTMLElement) {
    const svgDocument = (objectElement as any).contentDocument;
    const axeYMax = svgDocument.getElementById('maxYLegend');
    axeYMax.innerHTML = this.axeY.legend;

    const axeXMax = svgDocument.getElementById('maxXLegend');
    axeXMax.innerHTML = this.axeX.legend;
  }

  /**
   * @description: Ici ont va veiller a la generation de la liste des commentaires lier au cellule.
   */
  public contentCellManage(objectElement: HTMLElement, index: number = 0) {
    // Récupérez le document SVG
    const svgDocument = (objectElement as any).contentDocument;
    const cellContentGroup = svgDocument.getElementById('cellContent');
    const clonedGroup = cellContentGroup.cloneNode(true);
    const newId = 'cellContentClone';
    clonedGroup.setAttribute('id', newId);

    svgDocument.getElementById('graphContainer').appendChild(clonedGroup);

    const clonedGroup2 = cellContentGroup.cloneNode(true);
    const newId2 = 'cellContentClone2';
    clonedGroup2.setAttribute('id', newId2);

    svgDocument.getElementById('graphContainer').appendChild(clonedGroup2);

    clonedGroup2.setAttribute('transform', `translate(50, 50)`);

    const clonedGroup3 = cellContentGroup.cloneNode(true);
    const newId3 = 'cellContentClone3';
    clonedGroup3.setAttribute('id', newId3);
    
    svgDocument.getElementById('graphContainer').appendChild(clonedGroup3);

    clonedGroup3.setAttribute('transform', `translate(100, 50)`);

    clonedGroup.setAttribute('transform', `translate(100, 100)`);
    clonedGroup.addEventListener('click', () => {
      alert('Cercle cliqué !');
    });


  }

  /**
   * @description: 
   */
  public circleGenerate(objectElement: HTMLElement) {
    let circle_list: Array<CircleObject> = [];  
    let i = 0;
    for (let item of this.circle_list) {
      circle_list.push(new CircleObject(
        `circle`,
        i,
        objectElement=objectElement,
        item,
        this.graphContainer,
      ));
      i ++;
    }
  }
}
