"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getToken } from "@/app/util/token/token";

export default function Page() {
	const [login, setLogin] = useState(null); // 초기값을 null로 설정
	const router = useRouter();

	const [coIdx, setCoIdx] = useState("");
	const [company, setCompany] = useState([]);
	const [inContent, setInContent] = useState("");
	const [inLevel, setInLevel] = useState(1);

	// login 값이 있을 때 토큰을 가져오는 비동기 함수
	useEffect(() => {
		getToken().then((res) => {
			setLogin(res.IDX); // login 값 설정
			console.log(res);
		});
	}, []);

	// 회사 리스트 가져오기
	function getCompany() {
		axios.get("/api/jobseeker/companies").then((res) => {
			setCompany(res.data);
		});
	}

	useEffect(() => {
		getCompany();
	}, []);

	// 인터뷰 작성 함수
	function send() {
		if (!coIdx) {
			alert("회사명을 선택해 주세요.");
			return;
		}
		if (login !== null) {
			axios({
				url: "/api/jobseeker/interview",
				method: "post",
				params: {
					joIdx: login, // login 값 전달
					coIdx: coIdx,
					inContent: inContent,
					inLevel: inLevel,
				},
			})
				.then((res) => {
					alert("작성 완료");
					router.push(`/user/interview-list`);
				})
				.catch((error) => {
					alert("에러가 발생했습니다.");
				});
		} else {
			alert("로그인이 필요합니다.");
		}
	}

	// 난이도 선택 핸들러
	const handleLevelSelect = (level) => {
		setInLevel(level);
	};

	return (
		<div className='bg-gray-100 flex-1 ml-2 '>
			<div className='bg-white p-8 rounded-lg '>
				<h2 className='text-2xl font-bold text-center mb-6'>면접후기 작성하기</h2>

				<div className='mb-4'>
					<label htmlFor='coIdx' className='block text-sm font-medium text-gray-700'>
						회사명
					</label>
					<select
						value={coIdx}
						onChange={(e) => setCoIdx(e.target.value)}
						className='w-full rounded py-3 px-[14px] text-body-color text-base border border-[f0f0f0] outline-none focus-visible:shadow-none focus:border-primary'
					>
						<option value=''>회사선택</option>
						{company && company.length > 0 ? (
							company.map((companyItem) => (
								<option key={companyItem.id} value={companyItem.id}>
									{companyItem.coName}
								</option>
							))
						) : (
							<option value=''>회사 정보가 없습니다</option>
						)}
					</select>
				</div>

				<div className='mb-4'>
					<label htmlFor='inContent' className='block text-sm font-medium text-gray-700'>
						리뷰 내용
					</label>
					<textarea
						id='inContent'
						name='inContent'
						rows='4'
						placeholder='내용을 입력하세요'
						className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={inContent}
						onChange={(e) => setInContent(e.target.value)}
					></textarea>
				</div>

				{/* 난이도 선택 */}
				<div className='mb-4'>
					<label htmlFor='inLevel' className='block text-sm font-medium text-gray-700'>
						난이도
					</label>
					{/* SVG 별 모양 사용 */}
					<div className='flex items-center justify-center mt-2 space-x-1'>
						{[1, 2, 3, 4, 5].map((level) => (
							<svg
								key={level}
								className={`w-8 h-8 cursor-pointer ${inLevel >= level ? "text-yellow-500" : "text-gray-300"}`}
								fill='currentColor'
								viewBox='0 0 24 24'
								onClick={() => handleLevelSelect(level)}
							>
								<path d='M12 .587l3.668 7.431 8.167 1.184-5.894 5.741 1.389 8.091L12 18.897l-7.33 3.853 1.389-8.091L.167 9.202l8.167-1.184z' />
							</svg>
						))}
					</div>
				</div>

				<div className='flex justify-center'>
					<button className='w-full px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600' onClick={send}>
						수정하기
					</button>
				</div>
			</div>
		</div>
	);
}
