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
   * translate(-12, -14) -> position minimum en haut a gauche
   * translate(88, 88) -> position maximum en bas a droite
   */
  @Input()
  public circle_list: Array<CircleDrawType> = [
    {
      data: {
        title: 'oeauoeu',
        left_container: 'oeuoeu',
        right_container: '##$##',
        background_cell_color: '#FF0000',
      },
      percent_x: 0,
      percent_y: 20,
      r: 20,
      number: 0
    },
    {
      data: {
        title: 'eoauoeuaoe',
        left_container: '###',
        right_container: 'oeauoeu',
        background_cell_color: '#00FF00',
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
    this.renderer.setProperty(
      this.svgContainer.nativeElement, 
      'innerHTML', 
      `<object type="image/svg+xml" data="${svgUrl}" ></object>`
    );

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

  /**
   * @description: Download the picture of the chart. 
   */
  public downloadSvgAsPng() {
    const objectElement = this.svgContainer.nativeElement.querySelector('object');
    objectElement.contentDocument.documentElement.cloneNode(true);

    // Récupérer le contenu SVG modifié
    const svgElement = objectElement.contentDocument.documentElement;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);

    // Ajouter des déclarations de namespace manquantes
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    // Encoder le SVG en URI
    const imgData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;

    // Convertir le SVG en Canvas
    const img = new Image();
    const canvas = this.renderer.createElement('canvas');
    const context = canvas.getContext('2d');

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      
      // Convertir le Canvas en URL de données PNG
      const dataUrl = canvas.toDataURL('image/png');

      // Créer un lien pour le téléchargement
      const link = this.renderer.createElement('a');
      this.renderer.setAttribute(link, 'href', dataUrl);
      this.renderer.setAttribute(link, 'download', 'image.png');

      // Déclencher le téléchargement
      link.click();
      this.renderer.removeChild(document.body, link);
    };

    img.src = imgData;
  }
}
