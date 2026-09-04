/**
 * Official Lotto 6/45 Ball Color Mapping
 * 1-10: Yellow (#FBC400)
 * 11-20: Blue (#69C8F2)
 * 21-30: Red (#FF7272)
 * 31-40: Gray (#AAAAAA)
 * 41-45: Green (#B0D840)
 */

export function getBallColorInfo(number) {
  const num = Number(number);

  if (num >= 1 && num <= 10) {
    return {
      bg: '#FBC400',
      gradient: 'radial-gradient(circle at 35% 35%, #FFF2A1 0%, #FBC400 50%, #D49B00 100%)',
      shadowColor: 'rgba(251, 196, 0, 0.4)',
      textColor: '#332200',
      name: '노랑',
      category: '1-10'
    };
  } else if (num >= 11 && num <= 20) {
    return {
      bg: '#69C8F2',
      gradient: 'radial-gradient(circle at 35% 35%, #D4F0FF 0%, #69C8F2 50%, #208DBF 100%)',
      shadowColor: 'rgba(105, 200, 242, 0.4)',
      textColor: '#082E47',
      name: '파랑',
      category: '11-20'
    };
  } else if (num >= 21 && num <= 30) {
    return {
      bg: '#FF7272',
      gradient: 'radial-gradient(circle at 35% 35%, #FFCDCD 0%, #FF7272 50%, #C42B2B 100%)',
      shadowColor: 'rgba(255, 114, 114, 0.4)',
      textColor: '#4A0808',
      name: '빨강',
      category: '21-30'
    };
  } else if (num >= 31 && num <= 40) {
    return {
      bg: '#AAAAAA',
      gradient: 'radial-gradient(circle at 35% 35%, #EBEBEB 0%, #AAAAAA 50%, #666666 100%)',
      shadowColor: 'rgba(170, 170, 170, 0.4)',
      textColor: '#1A1A1A',
      name: '회색',
      category: '31-40'
    };
  } else if (num >= 41 && num <= 45) {
    return {
      bg: '#B0D840',
      gradient: 'radial-gradient(circle at 35% 35%, #E6F7A3 0%, #B0D840 50%, #729613 100%)',
      shadowColor: 'rgba(176, 216, 64, 0.4)',
      textColor: '#1C2E02',
      name: '초록',
      category: '41-45'
    };
  }

  return {
    bg: '#334155',
    gradient: 'radial-gradient(circle at 35% 35%, #94A3B8 0%, #475569 50%, #1E293B 100%)',
    shadowColor: 'rgba(51, 65, 85, 0.4)',
    textColor: '#FFFFFF',
    name: '기타',
    category: '기타'
  };
}
