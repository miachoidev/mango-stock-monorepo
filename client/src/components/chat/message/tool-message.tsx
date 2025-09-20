import { useState } from "react";
import { MessageContentProps, MessageContents } from "./message";
import { cn } from "@/lib/utils";
import { Orbit } from "lucide-react";
import { Message, ToolMessage } from "@/types/message";
import { useRouter } from "next/navigation";

export const ToolMessageContent = ({
  message,
  messages,
  ...props
}: MessageContentProps & {
  message: ToolMessage;
  messages: Message[];
}) => {
  // FUNCTION CALL 🟣 ========================================================
  if (message.tool_call) {
    if (message.tool_call?.name === "transfer_to_agent") {
      const agentName = message.tool_call?.args?.agent_name || "";

      return (
        <div
          className={cn(
            "text-gray-700 text-xs w-fit px-2 py-1 rounded-lg flex items-center",
            "gap-1 bg-blue-100 rounded-md"
          )}
        >
          Transferring to{" "}
          <span className="text-blue-500 font-medium">{agentName}</span>
        </div>
      );
    }
    if (message.tool_call?.name === "stock_recommendation_result") {
      return <StockRecommendationResult message={message} />;
    }
    if (message.tool_call?.name === "stock_analysis_result") {
      return <StockAnalysisResult message={message} />;
    }

    if (!message.isNew) return;

    return <CallToolMessage message={message} />;
  }

  // 🟡 FUNCTION RESPONSE ========================================================
  // function 은 event / tool은 response

  if (message.tool_response?.name === "transfer_to_agent") {
    return;
  }
  // if (message.tool_response?.name === "stock_analysis_result") {
  //   return <StockAnalysisResult message={message} />;
  // }

  return <ResponseMessage message={message} props={props} />;
};

const CallToolMessage = ({ message }: { message: ToolMessage }) => {
  const [title, setTitle] = useState<string>(message.tool_call?.name || "");

  return (
    <MessageContents message={message} timestamp={false}>
      <div
        className={cn(
          "w-full min-w-[300px] bg-[#ffffff19] hover:bg-gray-900 break-words",
          "border-gray-300 pl-2 py-1 text-sm text-white font-semibold"
        )}
      >
        {title} ....
      </div>
    </MessageContents>
  );
};

const StockAnalysisResult = ({ message }: { message: ToolMessage }) => {
  const router = useRouter();
  const onClickStock = () => {
    if (
      !message.tool_call?.args?.stock_code ||
      !message.tool_call?.args?.stock_name
    )
      return;
    router.push(
      `/stock/detail?code=${message.tool_call?.args?.stock_code}&name=${message.tool_call?.args?.stock_name}`
    );
  };

  if (!message.tool_call?.args) return;
  return (
    <div
      className={cn(
        "w-full min-w-[300px] bg-[#ffcd48] hover:bg-[#ffcd48]/80 break-words rounded-xl p-2",
        "border-gray-300 pl-2 py-2 text-xs text-black font-semibold cursor-pointer"
      )}
      onClick={onClickStock}
    >
      <div className="flex flex-col gap-1 text-black">
        <div className="text-lg font-bold">
          {message.tool_call?.args?.stock_name} (
          {message.tool_call?.args?.stock_code})
        </div>
        <div className=" text-blue-800">
          추천 : {message.tool_call?.args?.recommendation}
        </div>
        {message.tool_call?.args?.average_price && (
          <div className="">
            평균가 : {message.tool_call?.args?.average_price?.toLocaleString()}{" "}
            원
          </div>
        )}
        {message.tool_call?.args?.current_price && (
          <div className="">
            현재가 : {message.tool_call?.args?.current_price?.toLocaleString()}{" "}
            원
          </div>
        )}
        {message.tool_call?.args?.profit_loss_amount && (
          <div className="">
            평가금액 :{" "}
            {message.tool_call?.args?.profit_loss_amount?.toLocaleString()} 원
          </div>
        )}
        {message.tool_call?.args?.profit_loss_rate && (
          <div className="">
            평가금액 :{" "}
            {message.tool_call?.args?.profit_loss_rate?.toLocaleString()} 원
          </div>
        )}
        <div className=" mt-5">
          <div className="flex flex-col gap-1">
            {message.tool_call?.args?.reasons?.map((reason) => (
              <div key={reason}>- {reason}</div>
            ))}
          </div>
        </div>
        {message.tool_call?.args?.reasons && (
          <div className=" mt-5">
            <div className="flex flex-col gap-1">
              {message.tool_call?.args?.reasons?.map((reason) => (
                <div key={reason}>- {reason}</div>
              ))}
            </div>
          </div>
        )}

        {/* <div className="">
          홀딩 여부 : {message.tool_call?.args?.is_holding ? "홀딩" : "미홀딩"}
        </div> */}
      </div>
    </div>
  );
};

const StockRecommendationResult = ({ message }: { message: ToolMessage }) => {
  const router = useRouter();

  if (!message.tool_call?.args) return;

  const onClickStock = (stock: any) => {
    if (!stock["종목코드"] || !stock["종목명"]) return;
    router.push(
      `/stock/detail?code=${stock["종목코드"]}&name=${stock["종목명"]}`
    );
  };

  return (
    <div
      className={cn(
        "w-full min-w-[300px] bg-[#ffcd48] break-words rounded-xl p-2",
        "border-gray-300 pl-2 py-2 text-xs text-black font-semibold cursor-pointer"
      )}
    >
      <div className="flex flex-col gap-1 text-black">
        <div className=" text-blue-800 font-bold text-lg">추천 테마</div>
        <div className="border-b border-gray-900 pb-2">
          {message.tool_call?.args?.popular_themes?.map((theme, index) => (
            <div key={theme} className="text-md font-medium">
              {index + 1}. {theme}
            </div>
          ))}
        </div>
        <div className="text-md font-semibold mt-2">
          {message.tool_call?.args?.market_flow}
        </div>

        <div className="text-xs font-medium mt-2">
          {message.tool_call?.args?.investment_strategy}
        </div>

        <div className="text-xs font-medium mt-2 flex flex-col gap-2">
          {message.tool_call?.args?.recommended_stocks?.map(
            (stock: any, index: number) => (
              <div
                key={index}
                onClick={() => onClickStock(stock)}
                className="flex px-2 flex-col gap-1 bg-yellow-50 hover:bg-yellow-100 rounded-md p-2 cursor-pointer"
              >
                <div className="text-lg font-semibold text-blue-800">
                  {stock["종목명"]} ({stock["종목코드"]})
                </div>
                <div className="text-sm font-medium">
                  현재가: {stock["현재가"].split("+")[1].toLocaleString()} 원
                </div>
                <div className="text-sm font-medium">
                  상승률: {stock["상승률"].toLocaleString()}%
                </div>
                <div className="text-sm font-medium">
                  추천 등급: {stock["추천 등급"]}
                </div>
                <div className="text-sm font-medium">
                  투자 근거: {stock["투자 근거"]}
                </div>
                {/* <div className="text-sm font-medium">
                  목표가: {stock["목표가"].toLocaleString()}원
                </div> */}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const ResponseMessage = ({
  message,
  props,
}: {
  message: ToolMessage;
  props: {
    markdown?: boolean;
  };
}) => {
  const originalTitle = message.tool_response?.name || "";

  const [title, setTitle] = useState<string>(originalTitle);
  const [isResponse, setIsResponse] = useState<boolean>(false);

  let toolResult = "";

  if (message.tool_response?.response.return_msg) {
    toolResult += message.tool_response?.response.return_msg || "";
  }
  if (message.tool_response?.response.result) {
    toolResult += message.tool_response?.response.result || "";
  }
  if (message.tool_response?.response.message) {
    toolResult += message.tool_response?.response.message || "";
  }

  return (
    <MessageContents message={message} timestamp={false}>
      <div
        className={cn(
          "w-full min-w-[300px] bg-[#ffffff19] hover:bg-gray-900 break-words",
          "border-gray-300 pl-2 py-1",
          "flex flex-col gap-1"
        )}
        {...props}
      >
        <div className="text-sm text-white font-semibold">{title}</div>
        {toolResult && (
          <div className="text-xs text-gray-300 pb-2 border-t-1 border-gray-100">
            {toolResult}
          </div>
        )}
      </div>
    </MessageContents>
  );
};
