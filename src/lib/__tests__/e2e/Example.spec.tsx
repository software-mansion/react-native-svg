import {sendToDeviceAndReceive,} from "../../../__tests__/helpers";
import Svg, {Line} from "react-native-svg";
import * as fs from "node:fs";

test("epic rendering test", async () => {
    const response = await sendToDeviceAndReceive<RenderResponse>({
        type: "renderRequest", data: <Svg height="250" width="100">
            <Line
                x1="10%"
                y1="10%"
                x2="90%"
                y2="90%"
                stroke="red"
                strokeWidth="2"
            />
        </Svg>
    })
    fs.writeFile("test.png", Buffer.from(response.data, 'base64'), () => {
    })
    expect(1).toBe(1)
})
