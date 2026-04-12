/* <이어 붙인 수>
정수가 담긴 리스트 num_list가 주어집니다.
num_list의 홀수만 순서대로 이어 붙인 수와
짝수만 순서대로 이어 붙인 수의 합을 return하도록
solution 함수를 완성해주세요.
*/
function solution(num_list) {
    const odd = num_list.filter(n => n % 2 !== 0).join("");
    const even = num_list.filter(n => n % 2 === 0).join("");
    
    return Number(odd) + Number(even);
}