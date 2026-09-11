import cytoscape from 'cytoscape';
import fcose, { type FcoseLayoutOptions } from 'cytoscape-fcose';

// fcose handles nested (compound) nodes far better than the built-in cose layout.
cytoscape.use(fcose);

/** Force-directed layout that keeps children inside their folder/file/class containers. */
export const defaultLayout: FcoseLayoutOptions = {
  name: 'fcose',
  quality: 'proof',
  animate: false,
  fit: true,
  padding: 24,
  nodeDimensionsIncludeLabels: true,
};
