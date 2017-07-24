package com.horcrux.svg;

// TODO implement https://www.w3.org/TR/SVG2/text.html#TextLayoutAlgorithm

public class TextLayoutAlgorithm {
    void layoutText() {
/*

      Setup


	  Let root be the result of generating
	  typographic character positions for the
	  ‘text’ element and its subtree, laid out as if it
	  were an absolutely positioned element.

	    This will be a single line of text unless the
	    white-space property causes line breaks.



	  Let count be the number of DOM characters
	  within the ‘text’ element's subtree.


	  Let result be an array of length count
	  whose entries contain the per-character information described
	  above.  Each entry is initialized as follows:

	    its global index number equal to its position in the array,
	    its "x" coordinate set to "unspecified",
	    its "y" coordinate set to "unspecified",
	    its "rotate" coordinate set to "unspecified",
	    its "hidden" flag is false,
	    its "addressable" flag is true,
	    its "middle" flag is false,
	    its "anchored chunk" flag is false.

	  If result is empty, then return result.


	  Let CSS_positions be an array of length
	  count whose entries will be filled with the
	  x and y positions of the corresponding
	  typographic character in root. The array
	  entries are initialized to (0, 0).


	  Let "horizontal" be a flag, true if the writing mode of ‘text’
	  is horizontal, false otherwise.




      Set flags and assign initial positions

	For each array element with index i in
	result:



	  Set addressable to false if the character at index i was:


          part of the text content of a non-rendered element


	      discarded during layout due to being a
	      collapsed
		white space character, a soft hyphen character, or a
	      bidi control character; or


	      discarded during layout due to being a
	      collapsed
		segment break; or


	      trimmed
	      from the start or end of a line.




	      Since there is collapsible white space not addressable by glyph
	      positioning attributes in the following ‘text’ element
	      (with a standard font), the "B" glyph will be placed at x=300.

	    <text x="100 200 300">
	      A
	      B
	      </text>

	      This is because the white space before the "A", and all but one white space
	      character between the "A" and "B", is collapsed away or trimmed.




	  Set middle to true if the character at index i
	  is the second or later character that corresponds to a typographic character.


	  If the character at index i corresponds to a typographic character at the beginning of a line, then set the "anchored
	  chunk" flag of result[i] to true.

	    This ensures chunks shifted by text-anchor do not
	    span multiple lines.



	  If addressable is true and middle is false then
	  set CSS_positions[i] to the position of the
	  corresponding typographic character as determined by the CSS
	  renderer. Otherwise, if i > 0, then set
	  CSS_positions[i] =
	  CSS_positions[i − 1]




      Resolve character positioning

	Position adjustments (e.g values in a ‘x’ attribute)
	specified by a node apply to all characters in that node including
	characters in the node's descendants. Adjustments specified in
	descendant nodes, however, override adjustments from ancestor
	nodes. This section resolves which adjustments are to be applied to
	which characters. It also directly sets the rotate coordinate
	of result.



	  Set up:


	      Let resolve_x, resolve_y,
	      resolve_dx, and resolve_dy be arrays of
	      length count whose entries are all initialized
	      to "unspecified".


	      Set "in_text_path" flag false.

		This flag will allow ‘y’ (‘x’)
		attribute values to be ignored for horizontal (vertical)
		text inside ‘textPath’ elements.



	      Call the following procedure with the ‘text’ element node.




	  Procedure: resolve character
	      positioning:

	    A recursive procedure that takes as input a node and
	    whose steps are as follows:



	      If node is a ‘text’ or ‘tspan’ node:


		  Let index equal the "global index number" of the
		  first character in the node.


		  Let x, y, dx, dy
		  and rotate be the lists of values from the
		  corresponding attributes on node, or empty
		  lists if the corresponding attribute was not specified
		  or was invalid.


		  If "in_text_path" flag is false:


		      Let new_chunk_count
		      = max(length of x, length of y).


		  Else:


		      If the "horizontal" flag is true:


			  Let new_chunk_count = length of x.




		      Else:


			  Let new_chunk_count = length of y.






		  Let length be the number of DOM characters in the
		  subtree rooted at node.


		  Let i = 0 and j = 0.

		    i is an index of addressable characters in the node;
		    j is an index of all characters in the node.



		  While j < length, do:

		    This loop applies the ‘x’, ‘y’,
		    ‘dx’, ‘dy’ and ‘rotate’
		    attributes to the content inside node.



		      If the "addressable" flag of result[index +
		      j] is true, then:


			  If i < new_check_count, then
			  set the "anchored chunk" flag of
			  result[index + j] to
			  true. Else set the flag to false.

			    Setting the flag to false ensures that ‘x’
			    and ‘y’ attributes set in a ‘text’
			    element don't create anchored chunk in a ‘textPath’
			    element when they should not.



			  If i < length of x,
			  then set resolve_x[index
			  + j] to x[i].


			  If "in_text_path" flag is true and the "horizontal"
			  flag is false, unset
			  resolve_x[index].

			    The ‘x’ attribute is ignored for
			    vertical text on a path.



			  If i < length of y,
			  then set resolve_y[index
			  + j] to y[i].


			  If "in_text_path" flag is true and the "horizontal"
			  flag is true, unset
			  resolve_y[index].

			    The ‘y’ attribute is ignored for
			    horizontal text on a path.



			  If i < length of dx,
			  then set resolve_dx[index
			  + j] to dy[i].


			  If i < length of dy,
			  then set resolve_dy[index
			  + j] to dy[i].


			  If i < length of rotate,
			  then set the angle value of result[index
			  + j] to rotate[i].
			  Otherwise, if rotate is not empty, then
			  set result[index + j]
			  to result[index + j − 1].


			  Set i = i + 1.




		      Set j = j + 1.






	      If node is a ‘textPath’ node:


		  Let index equal the global index number of the
		  first character in the node (including descendant nodes).


		  Set the "anchored chunk" flag of result[index]
		  to true.

		    A ‘textPath’ element always creates an anchored chunk.



		  Set in_text_path flag true.




	      For each child node child of node:


		  Resolve glyph
		    positioning of child.




	      If node is a ‘textPath’ node:


		  Set "in_text_path" flag false.








      Adjust positions: dx, dy

	The ‘dx’ and ‘dy’ adjustments are applied
	before adjustments due to the ‘textLength’ attribute while
	the ‘x’, ‘y’ and ‘rotate’
	adjustments are applied after.



	  Let shift be the cumulative x and
	  y shifts due to ‘x’ and ‘y’
	  attributes, initialized to (0,0).


	  For each array element with index i in result:


	      If resolve_x[i] is unspecified, set it to 0.
	      If resolve_y[i] is unspecified, set it to 0.


	      Let shift.x = shift.x + resolve_x[i]
	      and shift.y = shift.y + resolve_y[i].


	      Let result[i].x = CSS_positions[i].x + shift.x
	      and result[i].y = CSS_positions[i].y + shift.y.






      Apply ‘textLength’ attribute


	  Set up:


	      Define resolved descendant node as a
	      descendant of node with a valid ‘textLength’
	      attribute that is not itself a descendant node of a
	      descendant node that has a valid ‘textLength’
	      attribute.


	      Call the following procedure with the ‘text’ element
	      node.




	  Procedure: resolve text length:

	    A recursive procedure that takes as input
	    a node and whose steps are as follows:



	      For each child node child of node:


		  Resolve text length of child.

		    Child nodes are adjusted before parent nodes.





	      If node is a ‘text’ or ‘tspan’ node
	      and if the node has a valid ‘textLength’ attribute value:


		  Let a = +∞ and b = −∞.


		  Let i and j be the global
		  index of the first character and last characters
		  in node, respectively.


		  For each index k in the range
		  [i, j] where the "addressable" flag
		  of result[k] is true:

		    This loop finds the left-(top-) most and
		    right-(bottom-) most extents of the typographic characters within the node and checks for
		    forced line breaks.



		      If the character at k is a linefeed
		      or carriage return, return. No adjustments due to
		      ‘textLength’ are made to a node with
		      a forced line break.


		      Let pos = the x coordinate of the position
		      in result[k], if the "horizontal"
		      flag is true, and the y coordinate otherwise.


		      Let advance = the advance of
		      the typographic character corresponding to
		      character k. [NOTE: This advance will be
		      negative for RTL horizontal text.]


		      Set a =
		      min(a, pos, pos
		      + advance).


		      Set b =
		      max(b, pos, pos
		      + advance).




		  If a ≠ +∞ then:


		      Find the distance delta = ‘textLength’
		      computed value − (b − a).

			User agents are required to shift the last
			typographic character in the node by
			delta, in the positive x direction
			if the "horizontal" flag is true and if
			direction is
			lrt, in the
			negative x direction if the "horizontal" flag
			is true and direction is
			rtl, or in the
			positive y direction otherwise.  User agents
			are free to adjust intermediate
			typographic characters for optimal
			typography. The next steps indicate one way to
			adjust typographic characters when
			the value of ‘lengthAdjust’ is
			spacing.



		      Find n, the total number of
		      typographic characters in this node
		      including any descendant nodes that are not resolved
		      descendant nodes or within a resolved descendant
		      node.


		      Let n = n + number of
		      resolved descendant nodes − 1.

			Each resolved descendant node is treated as if it
			were a single
			typographic character in this
			context.



		      Find the per-character adjustment δ
		      = delta/n.


		      Let shift = 0.


		      For each index k in the range [i,j]:


			  Add shift to the x coordinate of the
			  position in result[k], if the "horizontal"
			  flag is true, and to the y coordinate
			  otherwise.


			  If the "middle" flag for result[k]
			  is not true and k is not a character in
			  a resolved descendant node other than the first
			  character then shift = shift
			  + δ.












      Adjust positions: x, y

	This loop applies ‘x’ and ‘y’ values,
	and ensures that text-anchor chunks do not start in
	the middle of a typographic character.



	  Let shift be the current adjustment due to
	  the ‘x’ and ‘y’ attributes,
	  initialized to (0,0).


	  Set index = 1.


	  While index < count:


	      If resolved_x[index] is set, then let
	      shift.x =
	      resolved_x[index] −
	      result.x[index].


	      If resolved_y[index] is set, then let
	      shift.y =
	      resolved_y[index] −
	      result.y[index].


	      Let result.x[index] =
	        result.x[index] + shift.x
	      and result.y[index] =
		result.y[index] + shift.y.


	      If the "middle" and "anchored chunk" flags
	      of result[index] are both true, then:


		  Set the "anchored chunk" flag
		  of result[index] to false.


		  If index + 1 < count, then set
		  the "anchored chunk" flag
		  of result[index + 1] to true.




	      Set index to index + 1.






      Apply anchoring


	  For each slice result[i..j]
	  (inclusive of both i and j), where:


	      the "anchored chunk" flag of result[i]
	      is true,


	      the "anchored chunk" flags
	      of result[k] where i
	      < k ≤ j are false, and


	      j = count − 1 or the "anchored
	      chunk" flag of result[j + 1] is
	      true;


	  do:

	    This loops over each anchored chunk.



	      Let a = +∞ and b = −∞.


	      For each index k in the range
	      [i, j] where the "addressable" flag
	      of result[k] is true:

		This loop finds the left-(top-) most and
		right-(bottom-) most extents of the typographic character within the anchored chunk.



		  Let pos = the x coordinate of the position
		  in result[k], if the "horizontal" flag
		  is true, and the y coordinate otherwise.


		  Let advance = the advance of
		  the typographic character corresponding to
		  character k. [NOTE: This advance will be
		  negative for RTL horizontal text.]


		  Set a =
		  min(a, pos, pos
		  + advance).


		  Set b =
		  max(b, pos, pos
		  + advance).




	      If a ≠ +∞, then:

		Here we perform the text anchoring.



		  Let shift be the x coordinate of
		  result[i], if the "horizontal" flag
		  is true, and the y coordinate otherwise.


		  Adjust shift based on the value of text-anchor
		  and direction of the element the character at
		  index i is in:

		    (start, ltr) or (end, rtl)
		    Set shift = shift − a.
		    (start, rtl) or (end, ltr)
		    Set shift = shift − b.
		    (middle, ltr) or (middle, rtl)
		    Set shift = shift − (a + b) / 2.



		  For each index k in the range [i, j]:


		      Add shift to the x coordinate of the position
		      in result[k], if the "horizontal"
		      flag is true, and to the y coordinate otherwise.










      Position on path


	  Set index = 0.


	  Set the "in path" flag to false.


	  Set the "after path" flag to false.


	  Let path_end be an offset for characters that follow
	  a ‘textPath’ element. Set path_end to (0,0).


	  While index < count:


	      If the character at index i is within a
	      ‘textPath’ element and corresponds to a typographic character, then:


		  Set "in path" flag to true.


		  If the "middle" flag of
		  result[index] is false, then:

		    Here we apply ‘textPath’ positioning.



		      Let path be the equivalent path of
		      the basic shape element referenced by
		      the ‘textPath’ element, or an empty path if
		      the reference is invalid.


		      If the ‘side’ attribute of
		      the ‘textPath’ element is
		      'right', then
		      reverse path.


		      Let length be the length
		      of path.


		      Let offset be the value of the
		      ‘textPath’ element's
		      ‘startOffset’ attribute, adjusted
		      due to any ‘pathLength’ attribute on the
		      referenced element (if the referenced element is
		      a ‘path’ element).


		      Let advance = the advance of
		      the typographic character corresponding
		      to character k. [NOTE: This advance will
		      be negative for RTL horizontal text.]


		      Let (x, y)
		      and angle be the position and angle
		      in result[index].


		      Let mid be a coordinate value depending
		      on the value of the "horizontal" flag:

			true
			mid is x + advance / 2
			  + offset
			false
			mid is y + advance / 2
			  + offset


			The user agent is free to make any additional adjustments to
			mid necessary to ensure high quality typesetting
			due to a ‘spacing’ value of
			'auto' or a
			‘method’ value of
			'stretch'.



		      If path is not a closed subpath and
		      mid < 0 or mid > length,
		      set the "hidden" flag of result[index] to true.


		      If path is a closed subpath depending on
		      the values of text-anchor and direction of
		      the element the character at index is in:

			This implements the special wrapping criteria for single
			closed subpaths.


			(start, ltr) or (end, rtl)

			  If mid−offset < 0
			  or mid−offset > length,
			  set the "hidden" flag of result[index] to true.

			(middle, ltr) or (middle, rtl)

			  If
			  If mid−offset < −length/2
			  or mid−offset >  length/2,
			  set the "hidden" flag of result[index] to true.

			(start, rtl) or (end, ltr)

			  If mid−offset < −length
			  or mid−offset > 0,
			  set the "hidden" flag of result[index] to true.



			Set mid = mid mod length.


		    If the hidden flag is false:


			  Let point be the position and
			  t be the unit vector tangent to
			  the point mid distance
			  along path.


			  If the "horizontal" flag is

			    true



				  Let n be the normal unit vector
				  pointing in the direction t + 90°.


				  Let o be the horizontal distance from the
				  vertical center line of the glyph to the alignment point.


				  Then set the position in
				  result[index] to
				  point -
				  o×t +
				  y×n.


				  Let r be the angle from
				  the positive x-axis to the tangent.


				  Set the angle value
				  in result[index]
				  to angle + r.



			    false



				  Let n be the normal unit vector
				  pointing in the direction t - 90°.


				  Let o be the vertical distance from the
				  horizontal center line of the glyph to the alignment point.


				  Then set the position in
				  result[index] to
				  point -
				  o×t +
				  x×n.


				  Let r be the angle from
				  the positive y-axis to the tangent.


				  Set the angle value
				  in result[index]
				  to angle + r.










		  Otherwise, the "middle" flag
		  of result[index] is true:


		      Set the position and angle values
		      of result[index] to those
		      in result[index − 1].






	      If the character at index i is not within a
	      ‘textPath’ element and corresponds to a typographic character, then:

		This sets the starting point for rendering any characters that
		occur after a ‘textPath’ element to the end of the path.


		If the "in path" flag is true:


		      Set the "in path" flag to false.


		      Set the "after path" flag to true.


		      Set path_end equal to the end point of the path
		      referenced by ‘textPath’ − the position of
		      result[index].




		  If the "after path" is true.


		      If anchored chunk of
		      result[index] is true, set the
		      "after path" flag to false.


		      Else,
		      let result.x[index] =
		      result.x[index] + path_end.x
		      and result.y[index] =
		      result.y[index] + path_end.y.






	      Set index = index + 1.






      Return result

        */
    }
}
