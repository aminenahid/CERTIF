# PDF diploma generation

#
# Installation
#

# pip install fpdf
# pip install json-get
# pip install Pillow

#
# Imports
#

import os
import locale
import io
import json
import PIL

from PIL import Image
from datetime import datetime
from fpdf import FPDF
from binascii import a2b_base64
from jsonget import json_get_default

#
# Private generation functions
#

# Get a base64 image size
def __base64_image_size(image):
    image = image[image.index('base64')+7:]
    image += "=" * ((4 - len(image) % 4) % 4)
    return Image.open(io.BytesIO(a2b_base64(image))).size

# Write a base64 image to PDF
def __pdf_base64_image(pdf, image, x = None, y = None, w = 0, h = 0):
    # Prepare the image to be saved
    image = image[image.index('base64')+7:]
    image += "=" * ((4 - len(image) % 4) % 4)

    temp_file = '.temp' + str(__pdf_base64_image.counter) + '.png'
    __pdf_base64_image.counter += 1

    # Save the image in a temporary file
    with open(temp_file, 'wb') as fd:
        fd.write(a2b_base64(image))

    # Write the image to the PDF
    pdf.image(temp_file, x, y, w, h)

    # Remove the temporary file
    os.remove(temp_file)

__pdf_base64_image.counter = 0

# Get a field from a JSON diploma
def __get_field(diploma, field):
    if field.startswith('/'):
        return json_get_default(diploma, field, None)
    else:
        return field

# Default function to generate the diploma header
def __default_header(diploma, pdf, params):
    __pdf_base64_image(pdf, __get_field(diploma, params['header_logo']), w=params['header_logo_width'])
    pdf.set_y(15)
    pdf.set_font_size(12)
    pdf.cell(0, 6, __get_field(diploma, params['header_state']), 0, 1, 'C')
    pdf.set_font_size(15)
    pdf.cell(0, 8, __get_field(diploma, params['header_ministry']), 0, 1, 'C')
    pdf.set_font_size(16)
    pdf.cell(0, 12, __get_field(diploma, params['header_school']), 0, 1, 'C')
    pdf.set_font_size(17)
    pdf.multi_cell(0, 8, __get_field(diploma, params['header_diploma_name']), 0, 'C')

# Default function to generate the diploma body
def __default_body(diploma, pdf, params):
    pdf.set_y(pdf.get_y() + 10)
    pdf.set_font_size(12)
    pdf.multi_cell(0, 7, __get_field(diploma, params['body_description']), 0, 1, 'C')

# Default function to generate the diploma footer
def __default_footer(diploma, pdf, params):
    pdf.set_y(pdf.get_y() + 2)

    pdf.set_font_size(11)
    issued = __get_field(diploma, params['footer_date'])
    issued = datetime.strptime(issued[:issued.index('+')], '%Y-%m-%dT%H:%M:%S.%f')
    pdf.cell(0, 8, params['footer_pre_date'] + ' ' + issued.strftime(params['footer_date_format']), 0, 1, 'R')

    pdf.set_y(pdf.get_y() + 4)

    signatures = __get_field(diploma, params['footer_signatures'])
    count = len(signatures)

    if count>0:
        cell_width = (297 - params['margin'] * 2) / count

        for i in range(0 , count):
            signature = signatures[i]
            if i==0:
                align='L'
            elif i==count-1:
                align='R'
            else:
                align='C'
            pdf.cell(cell_width, 8, __get_field(signature, params['footer_signature_title']), 0, 0, align)

        y = pdf.get_y() + 8

        for i in range(0 , count):
            signature = signatures[i]
            image = __get_field(signature, params['footer_signature_image'])
            if image is not None:
                image_size = __base64_image_size(image)
                w = (image_size[1] / (params['footer_signature_image_height'] * 2)) * (image_size[0] / image_size[1])
                __pdf_base64_image(pdf, image, cell_width * (i + 0.5) + w * 0.5, y, 0, params['footer_signature_image_height'])

        pdf.set_x(0)
        pdf.set_y(pdf.get_y() + params['footer_signature_image_height'] + 13)

        for i in range(0 , count):
            signature = signatures[i]
            name = __get_field(signature, params['footer_signature_name'])
            if name is not None:
                pdf.cell(cell_width, 0, name, 0, 0, 'C')

# Setup the default customization parameters
def __setup_default_params(params):
    if 'margin' not in params:
        params['margin'] = 15

    if 'header' not in params:
        params['header'] = __default_header
    if 'body' not in params:
        params['body'] = __default_body
    if 'footer' not in params:
        params['footer'] = __default_footer

    if 'header_logo' not in params:
        params['header_logo'] = '/badge/image'
    if 'header_logo_width' not in params:
        params['header_logo_width'] = 47
    if 'header_state' not in params:
        params['header_state'] = 'REPUBLIQUE FRANÇAISE'
    if 'header_ministry' not in params:
        params['header_ministry'] = 'Ministère de l’Enseignement supérieur, de la Recherche et de l’Innovation'
    if 'header_school' not in params:
        params['header_school'] = '/badge/issuer/name'
    if 'header_diploma_name' not in params:
        params['header_diploma_name'] = '/badge/name'

    if 'body_description' not in params:
        params['body_description'] = '/badge/description'

    if 'footer_pre_date' not in params:
        params['footer_pre_date'] = 'Fait le'
    if 'footer_date' not in params:
        params['footer_date'] = '/issuedOn'
    if 'footer_date_format' not in params:
        params['footer_date_format'] = '%d %B %Y'
    if 'footer_signatures' not in params:
        params['footer_signatures'] = '/badge/signatureLines'
    if 'footer_signature_title' not in params:
        params['footer_signature_title'] = '/jobTitle'
    if 'footer_signature_image' not in params:
        params['footer_signature_image'] = '/image'
    if 'footer_signature_image_height' not in params:
        params['footer_signature_image_height'] = 16
    if 'footer_signature_name' not in params:
        params['footer_signature_name'] = '/name'

# Main function to generate a diploma PDF
def __pdf_diploma(diploma, params):
    locale.setlocale(locale.LC_TIME,'')

    __setup_default_params(params)

    pdf = FPDF('L', 'mm', 'A4')
    pdf.set_margins(params['margin'], params['margin'])
    pdf.set_auto_page_break(False)
    pdf.add_font('Arial', '', 'arial.ttf', uni=True) 
    pdf.set_font('Arial', '', 12)
    pdf.add_page()

    params['header'](diploma, pdf, params)
    params['body'](diploma, pdf, params)
    params['footer'](diploma, pdf, params)
    
    return pdf

#
# Public interfaces
#

#
# Make sure arial.ttf is in the current directory
#
# About the school_customizations optional parameter
# Fields can be a JSON path to search in the diploma or a static string
#
# The following values can be specified:
# - margin: numeric value in mm, defaults to 15
# - header: function(diploma, pdf, params)
#   - header_logo: field, defaults to '/badge/image'
#   - header_logo_width: numeric value in mm, defaults to 47
#   - header_state: field, defaults to 'REPUBLIQUE FRANÇAISE'
#   - header_ministry: field, defaults to 'Ministère de l’Enseignement supérieur, de la Recherche et de l’Innovation'
#   - header_school: field, defaults to '/badge/issuer/name'
#   - header_diploma_name: field, defaults to '/badge/name'
# - body: function(diploma, pdf, params)
#   - body_description: field, defaults to '/badge/description'
# - footer: function(diploma, pdf, params)
#   - footer_pre_date: string value, defaults to 'Fait le'
#   - footer_date: field, defauls to '/issuedOn'
#   - footer_date_format: string value, defaults to '%d %B %Y'
#   - footer_signatures: field, defaults to '/badge/signatureLines'
#     - footer_signature_title: field, defaults to '/jobTitle'
#     - footer_signature_image: field, defaults to '/image'
#     - footer_signature_image_height: numeric value in mm, defaults to 16
#     - footer_signature_name: field, defaults to '/name'
#

# Create a diploma PDF from a certificate JSON file and write it in the specified file
def pdf_diploma_from_file_to_file(diploma_input_path, pdf_output_path, school_customizations={}):
    pdf = None
    with open(diploma_input_path, encoding='utf-8') as json_file:
        diploma_json = json.load(json_file)
        pdf = __pdf_diploma(diploma_json, school_customizations)
    pdf.output(pdf_output_path, 'F')

# Create a diploma PDF from a certificate JSON file and return it as a byte string
def pdf_diploma_from_file_to_mem(diploma_input_path, school_customizations={}):
    pdf = None
    with open(diploma_input_path, encoding='utf-8') as json_file:
        diploma_json = json.load(json_file)
        pdf = __pdf_diploma(diploma_json, school_customizations)
    return pdf.output(dest='S').encode('latin-1')

# Create a diploma PDF from a python JSON certificate object and write it in the specified file
def pdf_diploma_from_mem_to_file(diploma_json, pdf_output_path, school_customizations={}):
    pdf = __pdf_diploma(diploma_json, school_customizations)
    pdf.output(pdf_output_path, 'F')

# Create a diploma PDF from a python JSON certificate object and return it as a byte string
def pdf_diploma_from_mem_to_mem(diploma_json, school_customizations={}):
    pdf = __pdf_diploma(diploma_json, school_customizations)
    return pdf.output(dest='S').encode('latin-1')
