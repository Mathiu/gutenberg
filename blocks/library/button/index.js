/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';
import { registerBlockType, source } from '../../api';
import Editable from '../../editable';
import UrlInputButton from '../../url-input/button';
import BlockControls from '../../block-controls';
import BlockAlignmentToolbar from '../../block-alignment-toolbar';
import ColorPalette from '../../color-palette';
import InspectorControls from '../../inspector-controls';

const { attr, children } = source;

registerBlockType( 'core/button', {
	title: __( 'Button' ),

	icon: 'button',

	category: 'layout',

	attributes: {
		url: {
			type: 'string',
			source: attr( 'a', 'href' ),
		},
		title: {
			type: 'string',
			source: attr( 'a', 'title' ),
		},
		text: {
			type: 'array',
			source: children( 'a' ),
		},
		align: {
			type: 'string',
			default: 'none',
		},
		color: {
			type: 'string',
		},
	},

	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( 'left' === align || 'right' === align || 'center' === align ) {
			return { 'data-align': align };
		}
	},

	edit( { attributes, setAttributes, focus, setFocus, className } ) {
		const { text, url, title, align, color } = attributes;
		const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );

		return [
			focus && (
				<BlockControls key="controls">
					<BlockAlignmentToolbar value={ align } onChange={ updateAlignment } />
				</BlockControls>
			),
			<span key="button" className={ className } title={ title } style={ { backgroundColor: color } } >
				<Editable
					tagName="span"
					placeholder={ __( 'Write label…' ) }
					value={ text }
					focus={ focus }
					onFocus={ setFocus }
					onChange={ ( value ) => setAttributes( { text: value } ) }
					formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
					keepPlaceholderOnFocus
					extraToolbarButtons={ <UrlInputButton url={ url } onChange={ ( { newUrl } ) => setAttributes( { url: newUrl } ) } /> }
				/>
				{ focus &&
					<InspectorControls key="inspector">
						<ColorPalette
							value={ color }
							onChange={ ( colorValue ) => setAttributes( { color: colorValue } ) }
						/>
						<InspectorControls.TextControl
							label={ __( 'Hex Color' ) }
							value={ color || '' }
							onChange={ ( value ) => setAttributes( { color: value } ) }
						/>
					</InspectorControls>
				}
			</span>,
		];
	},

	save( { attributes } ) {
		const { url, text, title, align, color } = attributes;

		return (
			<div className={ `align${ align }` } style={ { backgroundColor: color } }>
				<a href={ url } title={ title }>
					{ text }
				</a>
			</div>
		);
	},
} );
